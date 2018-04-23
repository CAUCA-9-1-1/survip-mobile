import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';

@IonicPage()
@Component({
  selector: 'page-intervention-course',
  templateUrl: 'intervention-course.html',
})
export class InterventionCoursePage {

  private hasNavigated: boolean;

  get plan(): InspectionDetail{
    return this.controller.inspectionDetail
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public controller: InspectionControllerProvider,
    private authService: AuthenticationService) {
    controller.loadCourseList();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    if (this.hasNavigated) {
      this.hasNavigated = false;
      this.controller.loadCourseList();
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

  onItemClick(idInterventionFormCourse: string) {
    this.hasNavigated = true;
    this.navCtrl.push("InterventionCourseDetailPage", {idInterventionFormCourse: idInterventionFormCourse});
  }
}
