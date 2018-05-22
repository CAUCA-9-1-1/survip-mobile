import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {InterventionGeneralPage} from '../intervention-general/intervention-general';
import {InterventionWaterSuppliesPage} from '../intervention-water-supplies/intervention-water-supplies';
import {InterventionBuildingsPage} from '../intervention-buildings/intervention-buildings';
import {InterventionCoursePage} from '../intervention-course/intervention-course';
import {InterventionFireProtectionPage} from '../repositories-fire-protection/repositories-fire-protection';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionQuestionPage} from "../inspection-question/inspection-question";
import {InspectionsPage} from '../inspections/inspections';
import {MenuItem} from '../../interfaces/menu-item.interface';

@IonicPage({
  segment: 'inspection/:id'
})
@Component({
  selector: 'page-intervention-home',
  templateUrl: 'intervention-home.html',
})
export class InterventionHomePage {
  private rootPage = 'InterventionGeneralPage';

  public fullName: string = '';
  public menuItems: MenuItem[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private controller: InspectionControllerProvider) {
    controller.setIdInterventionForm(this.navParams.data['id']);
    this.fullName = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
    this.menuItems = [
      { title: 'Infos générales', page:'InterventionGeneratePage', icon:'information-circle' },
      { title: 'Bâtiments', page:'InterventionBuildingsPage', icon:'home' },
      { title: 'Alimentation en eau', page:'InterventionWaterSuppliesPage', icon:'water' },
      { title: "Plan d'implantation", page:'InterventionImplantationPlanPage', icon:'image' },
      { title: 'Parcours', page:'InterventionCoursePage', icon:'map' }
    ];
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
	if (this.controller.inspectionDetail.isSurveyCompleted)
	{
	    this.navCtrl.push('InspectionQuestionSummaryPage', {idInspection: this.controller.idInspection});
	}
	else
	{
		this.navCtrl.push('InspectionQuestionPage', {
	        idInspection: this.controller.idInspection,
	        inspectionSurveyCompleted: this.controller.inspectionDetail.isSurveyCompleted
	    });
	}
}

  async goBackToInspectionList(){
    await this.navCtrl.popToRoot();
    await this.navCtrl.setRoot('InspectionListPage');
  }
}
