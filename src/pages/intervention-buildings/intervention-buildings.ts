import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InspectionBuildingForList} from '../../models/inspection-building-for-list';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionDetail} from '../../models/inspection-detail';

/**
 * Generated class for the InterventionBuildingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-intervention-buildings',
  templateUrl: 'intervention-buildings.html',
})
export class InterventionBuildingsPage {
  get plan(): InspectionDetail{
    return this.controller.inspectionDetail
  }

  get buildings(): InspectionBuildingForList[] {
    return this.controller.buildings;
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private controller: InspectionControllerProvider,
              private authService: AuthenticationService) {
    this.controller.loadBuildingList();
  }

  ionViewDidLoad() {
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(){
    this.navCtrl.setRoot('LoginPage');
  }
}
