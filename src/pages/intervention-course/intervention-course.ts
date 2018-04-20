import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionCourseDetailPage} from '../intervention-course-detail/intervention-course-detail';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionForm} from '../../models/intervention-form';

@IonicPage()
@Component({
  selector: 'page-intervention-course',
  templateUrl: 'intervention-course.html',
})
export class InterventionCoursePage {

  private hasNavigated: boolean;

  get plan(): InterventionForm{
    return this.controller.interventionForm
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public controller: InterventionControllerProvider,
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
