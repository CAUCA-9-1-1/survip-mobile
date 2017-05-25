import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InterventionGeneralPage} from '../intervention-general/intervention-general';
import {InterventionWaterSuppliesPage} from '../intervention-water-supplies/intervention-water-supplies';
import {InterventionBuildingsPage} from '../intervention-buildings/intervention-buildings';
import {InterventionCoursePage} from '../intervention-course/intervention-course';
import {InterventionFireProtectionPage} from '../intervention-fire-protection/intervention-fire-protection';

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
  private waterSuppliesPage = InterventionWaterSuppliesPage;
  private buildingsPage = 'InterventionBuildingsPage';
  private fireProtectionPage = 'InterventionFireProtectionPage';
  private coursePage = 'InterventionCoursePage'

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    /*this.rootPage = InterventionGeneralPage;
    this.generalPage = InterventionGeneralPage;
    this.buildingsPage = InterventionBuildingsPage;
    this.coursePage = InterventionCoursePage;
    this.fireProtectionPage = InterventionFireProtectionPage;
    this.waterSuppliesPage = InterventionWaterSuppliesPage;*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterventionHomePage');
  }

  openPage(page){
    this.rootPage = page;
  }
}
