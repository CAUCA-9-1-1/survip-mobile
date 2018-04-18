import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionPlanBuildingForlist} from '../../models/intervention-plan-building-forlist';
import {InterventionPlan} from '../../models/intervention-plan';
import {AuthenticationService} from '../../providers/Base/authentification.service';

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
  get plan(): InterventionPlan{
    return this.controller.interventionPlan
  }

  get buildings(): InterventionPlanBuildingForlist[] {
    return this.controller.buildings;
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private controller: InterventionControllerProvider,
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
