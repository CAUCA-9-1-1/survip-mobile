import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the BuildingMainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-building-main',
  templateUrl: 'building-main.html',
})
export class BuildingMainPage {
  public rootPage = 'BuildingDetailsPage';
  public detailsPage = 'BuildingDetailsPage';
  public contactsPage = 'BuildingContactsPage';
  public pnapsPage = 'BuildingPnapsPage';
  public hazardousMaterialPage = 'BuildingHazardousMaterialsPage';
  public alarmPanelsPage = 'BuildingAlarmPanelsPage';
  public waterSprinklersPage = 'BuildingWaterSprinklersPage';
  public particularRisksPage = 'BuildingParticularRisksPage';
  public anomaliesPage = 'BuildingAnomaliesPage';

  constructor(public navCtrl: NavController, public navParams: NavParams, private menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
  }

  public closeMenu() : void {
    this.menuCtrl.close();
  }

  public openPage(page) : void {
   this.rootPage = page;
  }
}
