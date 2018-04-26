import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionFormFireHydrantRepositoryProvider} from '../../providers/repositories/intervention-form-fire-hydrant-repository';
import {InspectionBuildingFireHydrantForLIst} from '../../models/intervention-form-fire-hydrant-for-list';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionBuildingFireHydrantForList} from '../../models/inspection-building-fire-hydrant-for-list';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionBuildingFireHydrantRepositoryProvider} from '../../providers/repositories/inspection-building-fire-hydrant-repository-provider';
import {CityFireHydrantPage} from "../city-fire-hydrant/city-fire-hydrant";

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

  get plan(): InspectionDetail{
    return this.controller.inspectionDetail
  }

  public fireHydrants: InspectionBuildingFireHydrantForList[] = [];

  constructor(public navCtrl: NavController,
              private authService: AuthenticationService,
              public navParams: NavParams,
              private controller : InspectionControllerProvider,
              private fireHydrantService: InspectionBuildingFireHydrantRepositoryProvider,
              ) {
    fireHydrantService.get(controller.idInspection)
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

  public onClickHydrant(idInspectionBuildingFireHydrant: string) {
    this.navCtrl.push('FireHydrantPage');
  }

  public onItemClick(idInspectionBuildingFireHydrant: string) {
      this.navCtrl.push('CityFireHydrantPage');
  }
}
