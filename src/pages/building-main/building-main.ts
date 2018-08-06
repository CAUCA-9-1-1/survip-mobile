import {Component, ViewChild} from '@angular/core';
import {App, IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {MenuItem} from '../../interfaces/menu-item.interface';
import {InterventionBuildingsPage} from "../intervention-buildings/intervention-buildings";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-building-main',
  templateUrl: 'building-main.html',
})
export class BuildingMainPage {

  private readonly idBuilding: string;
  private readonly name: string;

  @ViewChild('buildingContent') childNavCtrl: NavController;

  rootPage = 'BuildingDetailsPage';
  menuItems: MenuItem[];
  labels = {};

  constructor(
    private app: App,
    private controller: InspectionControllerProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController,
    private translateService: TranslateService) {

    this.loadTranslation();

    this.idBuilding = navParams.get("idBuilding");
    this.name = navParams.get('name');
    this.menuItems = [
      { title: this.labels['buildingDetail'], page:'BuildingDetailsPage', icon:'information-circle' },
      { title: this.labels['contacts'], page:'BuildingContactsPage', icon:'contacts' },
      { title: this.labels['pnaps'], page:'BuildingPnapsPage', icon:'people' },
      { title: this.labels['hazardousMaterial'], page:'BuildingHazardousMaterialsPage', icon:'nuclear' },
      { title: this.labels['fireSafety'], page:'BuildingFireProtectionPage', icon:'flame' },
      { title: this.labels['particularRisk'], page:'BuildingParticularRisksPage', icon:'flash' },
      { title: this.labels['anomalies'], page:'BuildingAnomaliesPage', icon:'warning' },
    ];

    console.log(this.menuItems);
  }

  loadTranslation()
  {
      this.translateService.get([
          'buildingDetail', 'contacts', 'hazardousMaterial', 'pnaps','fireSafety', 'particularRisk', 'anomalies'
      ]).subscribe(labels => {
              this.labels = labels;
          },
          error => {
              console.log(error)
          });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'inspectionMenu');
    this.menuCtrl.enable(true, 'buildingMenu');
      this.menuCtrl.enable(false, 'inspectionListMenu');
  }

  public goBackToBuildingList() {
      this.navCtrl.setRoot('InterventionBuildingsPage');
  }

  public openPage(page) : void {
    this.childNavCtrl.setRoot(page, this.getParams());
  }

  public getParams(){
    return{idBuilding: this.idBuilding, name: this.name};
  }
}
