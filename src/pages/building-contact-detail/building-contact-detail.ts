import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the BuildingContactDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-building-contact-detail',
  templateUrl: 'building-contact-detail.html',
})
export class BuildingContactDetailPage {
  private readonly idBuilding: string;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BuildingContactDetailPage');
  }

}
