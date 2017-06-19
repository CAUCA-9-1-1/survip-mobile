import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';

/**
 * Generated class for the InterventionBuildingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-intervention-buildings',
  templateUrl: 'intervention-buildings.html',
})
export class InterventionBuildingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public laneRepository: LaneRepositoryProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterventionBuildingsPage');
  }

}
