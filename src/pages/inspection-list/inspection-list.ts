import { Component } from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {HomePage} from '../home/home';
import {RiskLevel} from '../../models/risk-level';
import {Inspection} from '../../interfaces/inspection.interface';
import {InspectionProvider} from '../../providers/inspection/inspection';
import {RiskLevelProvider} from '../../providers/risk-level/risk-level';
import {InterventionHomePage} from '../intervention-home/intervention-home';

/**
 * Generated class for the InspectionListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inspection-list',
  templateUrl: 'inspection-list.html',
})
export class InspectionListPage {
  inspections: Inspection[];
  riskLevels: RiskLevel[];

  constructor(public appCtrl: App,
              public navCtrl: NavController,
              public navParams: NavParams,
              private riskLevelService: RiskLevelProvider,
              private inspectionService: InspectionProvider) {
    riskLevelService.getAll()
      .subscribe(risks => this.riskLevels = risks);

    inspectionService.getAll()
      .subscribe(inspections => this.inspections = inspections);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InspectionListPage');
  }

  getRiskDescription(idRiskLevel: string): string {
    const result = this.riskLevels.find(risk => risk.idRiskLevel === idRiskLevel);
    if (result != null) {
      return result.description;
    } else {
      return '';
    }
  }

  getRiskColor(idRiskLevel: string): string {
    const result = this.riskLevels.find(risk => risk.idRiskLevel === idRiskLevel);
    if (result != null) {
      return result.color;
    } else {
      return 'black';
    }
  }

  getRiskCode(idRiskLevel: string): string {
    const result = this.riskLevels.find(risk => risk.idRiskLevel === idRiskLevel);
    if (result != null) {
      return result.code;
    } else {
      return '-1';
    }
  }

  itemSelected(inspection: Inspection) {
    const riskCode: string = this.getRiskCode(inspection.idRiskLevel);
    if (riskCode == '3' || riskCode == '4') {
      this.appCtrl.getRootNav().push(InterventionHomePage);
    } else {
      console.log('nope');
    }
  }

  clickclick() {
    this.appCtrl.getRootNav().push(HomePage);
  }
}
