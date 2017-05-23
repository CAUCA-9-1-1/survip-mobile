import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the InspectionsPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-inspections',
  templateUrl: 'inspections.html'
})
@IonicPage()
export class InspectionsPage {

  inspectionListRoot = 'InspectionListPage'
  inspectionMapRoot = 'InspectionMapPage'


  constructor(public navCtrl: NavController) {}

}
