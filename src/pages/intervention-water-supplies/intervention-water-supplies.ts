import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionFormFireHydrantRepositoryProvider} from '../../providers/repositories/intervention-form-fire-hydrant-repository';
import {InterventionFormFireHydrantForList} from '../../models/intervention-form-fire-hydrant-for-list';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionForm} from '../../models/intervention-form';

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

  get plan(): InterventionForm{
    return this.controller.interventionForm
  }

  public fireHydrants: InterventionFormFireHydrantForList[];

  constructor(public navCtrl: NavController,
              private authService: AuthenticationService,
              public navParams: NavParams,
              private controller : InterventionControllerProvider,
              private fireHydrantService: InterventionFormFireHydrantRepositoryProvider
              ) {
    fireHydrantService.get(controller.idInterventionForm)
      .subscribe(result => this.fireHydrants = result);
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

  public onClickHydrant(idInterventionFormFireHydrant: string) {
    console.log("Ouvrir la page ici...");
  }
}
