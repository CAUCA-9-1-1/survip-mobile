import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the BuildingDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-building-details',
  templateUrl: 'building-details.html',
})
export class BuildingDetailsPage {

  public readonly idBuilding: string;
  public readonly name: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.idBuilding = navParams.get('idBuilding');
    this.name = navParams.get('name');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingDetailsPage');
  }
}
