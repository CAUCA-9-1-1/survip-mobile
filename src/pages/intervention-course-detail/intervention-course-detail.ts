import { Component } from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, reorderArray} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {FirestationForlist} from '../../models/firestation';
import {FirestationRepositoryProvider} from '../../providers/repositories/firestation-repository-provider.service';
import {InspectionBuildingCourse} from '../../models/inspection-building-course';
import {InspectionBuildingCourseLaneForList} from '../../models/inspection-building-course-lane-for-list';
import {InspectionBuildingCourseRepositoryProvider} from '../../providers/repositories/inspection-building-course-repository';
import {InspectionBuildingCourseLaneRepositoryProvider} from '../../providers/repositories/inspection-building-course-lane-repository-provider.service';
import {UUID} from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-intervention-course-detail',
  templateUrl: 'intervention-course-detail.html',
})
export class InterventionCourseDetailPage {
  private hasNavigated: boolean = true;
  private idInspectionFormCourse: string;

  public course: InspectionBuildingCourse;
  public courseLanes: InspectionBuildingCourseLaneForList[];
  public firestations: FirestationForlist[];
  public form: FormGroup;
  public changeOrder: Boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private authService: AuthenticationService,
    private firestationRepo: FirestationRepositoryProvider,
    private courseRepo: InspectionBuildingCourseRepositoryProvider,
    private courseLaneRepo: InspectionBuildingCourseLaneRepositoryProvider,
    public controller: InspectionControllerProvider,
    private alertCtrl: AlertController,
    private load: LoadingController,
    private fb: FormBuilder){

    this.createForm();
    this.idInspectionFormCourse = navParams.get('idInspectionBuildingCourse');
  }

  async ionViewDidEnter() {
    if (this.hasNavigated) {
      let loader = this.load.create({content: 'Patientez...'});
      loader.present();
      await this.loadFirestations();
      await this.loadSpecificCourse(this.idInspectionFormCourse);
      await loader.dismiss();
    }
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

  private loadSpecificCourse(idInterventionFormCourse: string) {
      if (idInterventionFormCourse == null) {
        this.createPlanCourse();
        this.setValuesAndStartListening();
      }
      else {
        const result = this.courseRepo.get(idInterventionFormCourse);
        result.subscribe(data => {
          this.course = data.course as InspectionBuildingCourse;
          this.courseLanes = data.lanes;
          this.setValuesAndStartListening();
        });
      }
  }

  createPlanCourse() {
    let course = new InspectionBuildingCourse();
    course.id = UUID.UUID();
    this.idInspectionFormCourse = course.id;
    course.idBuilding = this.controller.inspectionDetail.idBuilding;
    this.course = course;
    this.courseLanes = [];
  }

  private async loadFirestations() {
    const result = await this.firestationRepo.getList(this.controller.inspectionDetail.idCity);
    this.firestations = result;
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(){
    this.navCtrl.setRoot('LoginPage');
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
    if (this.course != null) {
      this.form.patchValue(this.course);
    }
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      this.saveForm();
    }
  }

  private saveForm() {
    const formModel  = this.form.value;
    Object.assign(this.course, formModel);
    this.saveCourse();
    this.form.markAsPristine();
  }

  public onChangeOrder(): void {
      this.changeOrder = !this.changeOrder;
  }

  public async onReorderLane(indexes){
      this.courseLanes = reorderArray(this.courseLanes, indexes);
      await this.setLanesSequenceAndSave();
  }

  async setLanesSequenceAndSave() {
    for(let i = 0; i < this.courseLanes.length; i++) {
      let item = this.courseLanes[i];
      if (item.sequence != i + 1) {
        item.sequence = i + 1;
        await this.courseLaneRepo.saveCourseLaneSequence(item.id, item.sequence);
      }
    }
  }

  public onClickLane(idInspectionBuildingCourseLane: string): void {
    if (idInspectionBuildingCourseLane == null && !this.form.valid) {
      let alert = this.alertCtrl.create({
        title: 'Avertissement',
        message: "Vous devez sélectionner une caserne avant de pouvoir ajouter une rue.",
        buttons: ['Ok']});

      alert.present();
    } else
      this.navigateToLanePage(idInspectionBuildingCourseLane);
  }

  private navigateToLanePage(idInspectionBuildingCourseLane: string) {
    this.hasNavigated = true;
    this.navCtrl.push("InterventionCourseLanePage", {
      idInspectionBuildingCourseLane: idInspectionBuildingCourseLane,
      idInspectionBuildingCourse: this.idInspectionFormCourse,
      nextSequence: this.courseLanes.length + 1
    });
  }

  private onDeleteCourse() {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer ce parcours?',
      buttons: [
        {text: 'Non', role: 'cancel'},
        {text: 'Oui', handler: () => { this.deleteCourse().subscribe(() => this.goBack()); }}
      ]});
    alert.present();
  }

  private saveCourse(){
    let loader = this.load.create({content: 'Patientez...'});
    loader.present();
    this.courseRepo.save(this.course)
      .subscribe(ok => {
        loader.dismiss();
      })
  }

  private deleteCourse(){
    console.log("euhhhhhhhhh");
    let loader = this.load.create({content: 'Patientez...'});
    loader.present();
    let result = this.courseRepo.delete(this.course);
    loader.dismiss();
    return result;
  }

  private goBack(): void {
    this.navCtrl.pop();
  }
}
