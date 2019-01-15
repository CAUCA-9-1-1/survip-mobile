import {Component} from '@angular/core';
import {App, IonicPage, MenuController, NavController, NavParams, ViewController} from 'ionic-angular';
import {InspectionBuildingForList} from '../../models/inspection-building-for-list';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {Inspection} from "../../interfaces/inspection.interface";

@IonicPage()
@Component({
    selector: 'page-intervention-buildings',
    templateUrl: 'intervention-buildings.html',
})
export class InterventionBuildingsPage {
  public get currentInspection(): Inspection {
    return this.controller.currentInspection;
  }

  get buildings(): InspectionBuildingForList[] {
        return this.controller.buildings;
    }

    constructor(public navCtrl: NavController,
                private viewCtrl: ViewController,
                private appCtrl: App,
                public navParams: NavParams,
                private controller: InspectionControllerProvider,
                private menuCtrl: MenuController) {
        this.controller.loadBuildingList();
    }

    public async ionViewCanEnter() {
        this.menuCtrl.enable(true, 'inspectionMenu');
        this.menuCtrl.enable(false, 'buildingMenu');
    }

    public async onClickBuilding(idBuilding: string, name: string) {
        this.navCtrl.push("BuildingMainPage", {idBuilding: idBuilding, name: name});
    }
}
