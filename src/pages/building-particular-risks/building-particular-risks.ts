import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';

@IonicPage()
@Component({
  selector: 'page-building-particular-risks',
  templateUrl: 'building-particular-risks.html',
})
export class BuildingParticularRisksPage {

  private readonly name: string;

  public readonly idBuilding: string;
  public currentSegment: string = "foundation";

  constructor(
    private authService: AuthenticationService,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.idBuilding = navParams.get('idBuilding');
    this.name = navParams.get('name');
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(): void{
    this.navCtrl.setRoot('LoginPage');
  }

  ionViewDidLoad() {
  }
}
