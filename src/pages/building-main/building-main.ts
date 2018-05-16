import {Component, ViewChild} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {normalizeAsyncValidator} from '@angular/forms/src/directives/normalize_validator';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InterventionGeneralPage} from '../intervention-general/intervention-general';

@IonicPage()
@Component({
  selector: 'page-building-main',
  templateUrl: 'building-main.html',
})
export class BuildingMainPage {

  private readonly idBuilding: string;
  private readonly name: string;

  @ViewChild('buildingContent') childNavCtrl: NavController;

  public rootPage = 'BuildingDetailsPage';
  public detailsPage = 'BuildingDetailsPage';
  public contactsPage = 'BuildingContactsPage';
  public pnapsPage = 'BuildingPnapsPage';
  public hazardousMaterialPage = 'BuildingHazardousMaterialsPage';
  public fireProtectionPage = 'BuildingFireProtectionPage';
  public particularRisksPage = 'BuildingParticularRisksPage';
  public anomaliesPage = 'BuildingAnomaliesPage';

  constructor(
    private controller: InspectionControllerProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController) {

    this.idBuilding = navParams.get("idBuilding");
    this.name = navParams.get('name');
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'inspectionMenu');
    this.menuCtrl.enable(true, 'buildingMenu');
  }

  public closeMenu() : void {
    this.menuCtrl.close();
  }

  public async goBackToInspection() {
    await this.navCtrl.popToRoot();
    await this.navCtrl.setRoot('InterventionHomePage', {id: this.controller.idInspection});
  }

  public openPage(page) : void {
    this.childNavCtrl.setRoot(page, this.getParams());
  }

  public getParams(){
    return{idBuilding: this.idBuilding, name: this.name};
  }
}
