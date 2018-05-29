import {Component, ViewChild} from '@angular/core';
import {App, IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {MenuItem} from '../../interfaces/menu-item.interface';
import {InterventionBuildingsPage} from "../intervention-buildings/intervention-buildings";

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
  public menuItems: MenuItem[];

  constructor(
    private app: App,
    private controller: InspectionControllerProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private menuCtrl: MenuController) {

    this.idBuilding = navParams.get("idBuilding");
    this.name = navParams.get('name');
    this.menuItems = [
      { title: 'Détails du bâtiment', page:'BuildingDetailsPage', icon:'information-circle' },
      { title: 'Contacts', page:'BuildingContactsPage', icon:'contacts' },
      { title: 'PNAPS', page:'BuildingPnapsPage', icon:'people' },
      { title: 'Matières dangereuses', page:'BuildingHazardousMaterialsPage', icon:'nuclear' },
      { title: 'Protection incendie', page:'BuildingFireProtectionPage', icon:'flame' },
      { title: 'Risques particuliers', page:'BuildingParticularRisksPage', icon:'flash' },
      { title: 'Anomalies', page:'BuildingAnomaliesPage', icon:'warning' },
    ];

    console.log(this.menuItems);
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'inspectionMenu');
    this.menuCtrl.enable(true, 'buildingMenu');
  }

  public goBackToBuildingList() {
    this.app.getRootNav().popTo('InterventionBuildingsPage');
  }

  public openPage(page) : void {
    this.childNavCtrl.setRoot(page, this.getParams());
  }

  public getParams(){
    return{idBuilding: this.idBuilding, name: this.name};
  }
}
