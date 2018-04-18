import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';

/**
 * Generated class for the InterventionWaterSuppliesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-intervention-water-supplies',
  templateUrl: 'intervention-water-supplies.html',
})
export class InterventionWaterSuppliesPage {

  constructor(public navCtrl: NavController,
              private authService: AuthenticationService,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterventionWaterSuppliesPage');
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage() {
    this.navCtrl.setRoot('LoginPage');
  }
}
