import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionPlan} from '../../models/intervention-plan';

/**
 * Generated class for the InterventionCoursePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-intervention-course',
  templateUrl: 'intervention-course.html',
})
export class InterventionCoursePage {

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
  }

  onItemClick(idInterventionPlanCourse: string) {
    console.log(idInterventionPlanCourse);
  }
}
