import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionCourseDetailPage} from '../intervention-course-detail/intervention-course-detail';

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
    public controller: InterventionControllerProvider,
    private modalCtrl: ModalController) {
    controller.loadCourseList();
  }

  ionViewDidLoad() {
  }

  onItemClick(idInterventionPlanCourse: string) {
    this.navCtrl.push("InterventionCourseDetailPage", {idInterventionPlanCourse: idInterventionPlanCourse});
    /*let profileModal = this.modalCtrl.create(InterventionCourseDetailPage, {
      idInterventionPlanCourse: idInterventionPlanCourse
    });
    profileModal.onDidDismiss(data => {
      this.controller.loadCourseList();
    });
    profileModal.present();*/
  }
}
