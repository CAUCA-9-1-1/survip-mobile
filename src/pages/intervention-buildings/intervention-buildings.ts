import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
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
              private viewCtrl: ViewController,
              private appCtrl: App,
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

  public async onClickBuilding(idBuilding: string, name: string){
    this.navCtrl.push("BuildingMainPage", { idBuilding: idBuilding, name: name});
  }
}
