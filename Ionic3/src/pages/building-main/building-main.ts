import {Component, ViewChild} from '@angular/core';
import {App, IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {MenuItem} from '../../interfaces/menu-item.interface';
import {InterventionBuildingsPage} from "../intervention-buildings/intervention-buildings";
import {TranslateService} from "@ngx-translate/core";
import {InspectionConfigurationProvider} from '../../providers/inspection-configuration/inspection-configuration';

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
    public labels = {};

    constructor(
        private app: App,
        private controller: InspectionControllerProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        private menuCtrl: MenuController,
        private configurationService: InspectionConfigurationProvider,
        private translateService: TranslateService) {

        this.loadTranslation();

        this.idBuilding = navParams.get("idBuilding");
        this.name = navParams.get('name');
        const configuration = this.configurationService.configuration;
        this.menuItems = [
            {title: this.labels['buildingDetail'], page: 'BuildingDetailsPage', icon: 'information-circle', enabled: configuration.hasBuildingDetails, customAction: null},
            {title: this.labels['contacts'], page: 'BuildingContactsPage', icon: 'contacts', enabled: configuration.hasBuildingContacts, customAction: null},
            {title: this.labels['pnaps'], page: 'BuildingPnapsPage', icon: 'people', enabled: configuration.hasBuildingPnaps, customAction: null},
            {title: this.labels['hazardousMaterial'], page: 'BuildingHazardousMaterialsPage', icon: 'nuclear', enabled: configuration.hasBuildingHazardousMaterials, customAction: null},
            {title: this.labels['fireSafety'], page: 'BuildingFireProtectionPage', icon: 'flame', enabled: configuration.hasBuildingFireProtection, customAction: null},
            {title: this.labels['particularRisk'], page: 'BuildingParticularRisksPage', icon: 'flash', enabled: configuration.hasBuildingParticularRisks, customAction: null},
            {title: this.labels['anomalies'], page: 'BuildingAnomaliesPage', icon: 'warning', enabled: configuration.hasBuildingAnomalies, customAction: null},
        ];
        this.rootPage = this.getFirstEnabledMenuItem().page;
    }

    private getFirstEnabledMenuItem():MenuItem{
      for(let item of this.menuItems){
        if (item.enabled)
          return item;
      }
    }

    public loadTranslation() {
        this.translateService.get([
            'buildingDetail', 'contacts', 'hazardousMaterial', 'pnaps', 'fireSafety', 'particularRisk', 'anomalies'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public ionViewDidEnter() {
        this.menuCtrl.enable(false, 'inspectionMenu');
        this.menuCtrl.enable(true, 'buildingMenu');
        this.menuCtrl.enable(false, 'inspectionListMenu');
    }

    public goBackToBuildingList() {
        this.navCtrl.setRoot('InterventionBuildingsPage');
    }

    public openPage(page): void {
        this.childNavCtrl.setRoot(page, this.getParams());
    }

    public getParams() {
        return {idBuilding: this.idBuilding, name: this.name};
    }
}
