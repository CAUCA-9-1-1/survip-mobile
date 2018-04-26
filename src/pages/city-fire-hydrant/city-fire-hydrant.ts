import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CityFireHydrantForList} from "../../models/city-fire-hydrant-for-list";

/**
 * Generated class for the CityFireHydrantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-city-fire-hydrant',
  templateUrl: 'city-fire-hydrant.html',
})
export class CityFireHydrantPage {

    public fireHydrants: CityFireHydrantForList[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CityFireHydrantPage');
  }

}
