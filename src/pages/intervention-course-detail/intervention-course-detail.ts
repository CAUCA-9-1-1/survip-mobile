import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, reorderArray} from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
    public controller: InterventionControllerProvider,
    private alertCtrl: AlertController,
    private fb: FormBuilder){
    this.createForm();
    controller.courseLoaded.subscribe(() => this.setValuesAndStartListening());
    controller.loadFirestations();
    controller.loadSpecificCourse(navParams.get('idInterventionPlanCourse'));
  }

  ionViewDidLoad() {
  }

  ionViewCanLeave() {
    if (this.form.dirty || !this.form.valid) {
      return new Promise((resolve, rejeect) => {
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

  ionViewDidEnter() {
    if (this.hasNavigated) {
      this.hasNavigated = false;
      this.controller.loadSpecificCourse(this.navParams.get('idInterventionPlanCourse'));
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

  public onClickLane(idInterventionPlanCourseLane: string): void {
    this.hasNavigated = true;
    this.navCtrl.push("InterventionCourseLanePage", {idInterventionPlanCourseLane: idInterventionPlanCourseLane});
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
