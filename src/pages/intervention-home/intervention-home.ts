import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {InterventionGeneralPage} from '../intervention-general/intervention-general';
import {InterventionWaterSuppliesPage} from '../intervention-water-supplies/intervention-water-supplies';
import {InterventionBuildingsPage} from '../intervention-buildings/intervention-buildings';
import {InterventionCoursePage} from '../intervention-course/intervention-course';
import {InterventionFireProtectionPage} from '../repositories-fire-protection/repositories-fire-protection';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';

@IonicPage()
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private controller: InterventionControllerProvider) {
    console.log(this.navParams.data);
    controller.setIdInterventionForm(this.navParams.data['id']);
  }

  ionViewDidLoad() {
  }

  closeMenu(){
    this.menuCtrl.close();
  }

  openPage(page){
    this.rootPage = page;
  }
}
