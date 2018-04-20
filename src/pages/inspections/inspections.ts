import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InspectionMapPage} from '../inspection-map/inspection-map';

@Component({
  selector: 'page-inspections',
  templateUrl: 'inspections.html'
})
@IonicPage()
export class InspectionsPage {
  inspectionListRoot = 'InspectionListPage';
  inspectionMapRoot = InspectionMapPage;
  idInterventionForm: string;

  constructor(public navCtrl: NavController) {
  }
}
