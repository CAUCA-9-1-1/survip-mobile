import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {InterventionGeneralPage} from '../intervention-general/intervention-general';
import {InterventionWaterSuppliesPage} from '../intervention-water-supplies/intervention-water-supplies';
import {InterventionBuildingsPage} from '../intervention-buildings/intervention-buildings';
import {InterventionCoursePage} from '../intervention-course/intervention-course';
import {InterventionFireProtectionPage} from '../repositories-fire-protection/repositories-fire-protection';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionQuestionPage} from "../inspection-question/inspection-question";
import {InspectionsPage} from '../inspections/inspections';

@IonicPage({
  segment: 'inspection/:id'
})
@Component({
  selector: 'page-intervention-home',
  templateUrl: 'intervention-home.html',
})
export class InterventionHomePage {
  private rootPage = 'InterventionGeneralPage';
  private generalPage = 'InterventionGeneralPage';
  private waterSuppliesPage = 'InterventionWaterSuppliesPage';
  private buildingsPage = 'InterventionBuildingsPage';
  private fireProtectionPage = 'InterventionFireProtectionPage';
  private coursePage = 'InterventionCoursePage';
  private implantationPlanPage = 'InterventionImplantationPlanPage'

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private controller: InspectionControllerProvider) {
    controller.setIdInterventionForm(this.navParams.data['id']);
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true, 'inspectionMenu');
    this.menuCtrl.enable(false, 'buildingMenu');
  }

  closeMenu() {
    this.menuCtrl.close();
  }

  openPage(page) {
    this.rootPage = page;
  }

  goToInspectionQuestions() {
    this.navCtrl.push('InspectionQuestionPage', {
      idInspection: this.controller.idInspection,
      inspectionSurveyCompleted: this.controller.inspectionDetail.isSurveyCompleted
    });
  }

  async goBackToInspectionList(){
    await this.navCtrl.popToRoot();
    await this.navCtrl.setRoot('InspectionListPage');
  }
}
