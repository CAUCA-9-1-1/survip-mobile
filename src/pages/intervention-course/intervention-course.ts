import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionCourseDetailPage} from '../intervention-course-detail/intervention-course-detail';

@IonicPage()
@Component({
  selector: 'page-intervention-course',
  templateUrl: 'intervention-course.html',
})
export class InterventionCoursePage {

  private hasNavigated: boolean;

  get plan(): InterventionPlan{
    return this.controller.interventionPlan
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public controller: InterventionControllerProvider) {
    controller.loadCourseList();
  }

  ionViewDidLoad() {
    console.log('did load yo');
  }

  ionViewDidEnter() {
    if (this.hasNavigated) {
      this.hasNavigated = false;
      this.controller.loadCourseList();
    }
  }

  onItemClick(idInterventionPlanCourse: string) {
    this.hasNavigated = true;
    this.navCtrl.push("InterventionCourseDetailPage", {idInterventionPlanCourse: idInterventionPlanCourse});
  }
}
