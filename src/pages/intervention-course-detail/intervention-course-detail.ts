import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, reorderArray} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';

@IonicPage()
@Component({
  selector: 'page-intervention-course-detail',
  templateUrl: 'intervention-course-detail.html',
})
export class InterventionCourseDetailPage {
  private hasNavigated: boolean;

  public form: FormGroup;
  public changeOrder: Boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthenticationService,
    public controller: InspectionControllerProvider,
    private alertCtrl: AlertController,
    private fb: FormBuilder){
    this.createForm();
    controller.courseLoaded.subscribe(() => this.setValuesAndStartListening());
    controller.loadFirestations();
    controller.loadSpecificCourse(navParams.get('idInterventionFormCourse'));
  }

  ionViewDidLoad() {
  }

  ionViewCanLeave() {
    if (this.form.dirty || !this.form.valid) {
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: 'Confirmation',
          message: "Le parcours contient des erreurs de validation et n'a pas été sauvegardé.  Voulez-vous quand même retourner à la page précédente?",
          buttons: [
            {text: 'Non', handler: () => { resolve(false); }},
            {text: 'Oui', handler: () => { resolve(true); }}
          ]});

        return alert.present()
      });
    }
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(){
    this.navCtrl.setRoot('LoginPage');
  }

  ionViewDidEnter() {
    if (this.hasNavigated) {
      this.hasNavigated = false;
      this.controller.loadSpecificCourse(this.navParams.get('idInterventionFormCourse'));
    }
  }

  private createForm() {
    this.form = this.fb.group({idFirestation: ['', Validators.required]});
  }

  setValuesAndStartListening() {
    this.setValues();
    this.startWatchingForm();
  }

  private startWatchingForm() {
    this.form.valueChanges
      .debounceTime(500)
      .subscribe(() => this.saveIfValid());
  }

  private setValues() {
    if (this.controller.course != null) {
      this.form.patchValue(this.controller.course);
    }
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      this.saveForm();
    }
  }

  private saveForm() {
    const formModel  = this.form.value;
    Object.assign(this.controller.course, formModel);
    this.controller.saveCourse();
    this.form.markAsPristine();
  }

  public onChangeOrder(): void {
      this.changeOrder = !this.changeOrder;
  }

  public onReorderLane(indexes){
      this.controller.courseLanes = reorderArray(this.controller.courseLanes, indexes);
      this.controller.setLanesSequenceAndSave();
  }

  public onClickLane(idInterventionFormCourseLane: string): void {
    if (idInterventionFormCourseLane == null && !this.form.valid) {
      let alert = this.alertCtrl.create({
        title: 'Avertissement',
        message: "Vous devez sélectionner une caserne avant de pouvoir ajouter une rue.",
        buttons: ['Ok']});

      alert.present();
    } else
      this.navigateToLanePage(idInterventionFormCourseLane);
  }

  private navigateToLanePage(idInterventionFormCourseLane: string) {
    this.hasNavigated = true;
    this.navCtrl.push("InterventionCourseLanePage", {idInterventionFormCourseLane: idInterventionFormCourseLane});
  }

  private onDeleteCourse() {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer ce parcours?',
      buttons: [
        {text: 'Non', role: 'cancel'},
        {text: 'Oui', handler: () => { this.controller.deleteCourse().subscribe(() => this.goBack()); }}
      ]});

    alert.present();
  }

  private goBack(): void {
    this.navCtrl.pop();
  }
}
