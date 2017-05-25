import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {InterventionGeneralPage} from '../intervention-general/intervention-general';
import {InterventionWaterSuppliesPage} from '../intervention-water-supplies/intervention-water-supplies';
import {InterventionBuildingsPage} from '../intervention-buildings/intervention-buildings';
import {InterventionCoursePage} from '../intervention-course/intervention-course';
import {InterventionFireProtectionPage} from '../intervention-fire-protection/intervention-fire-protection';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';

/**
 * Generated class for the InterventionHomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private controller: InterventionControllerProvider) {
    controller.loadPlan(this.navParams.data['id']);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterventionHomePage');
  }

  closeMenu(){
    this.menuCtrl.close();
  }

  openPage(page){
    this.rootPage = page;
  }
}
