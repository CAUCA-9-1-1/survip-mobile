import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CityFireHydrantForList} from "../../models/city-fire-hydrant-for-list";
import {BuildingFireHydrantRepositoryProvider} from "../../providers/repositories/building-fire-hydrant-repository";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";

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

    public cityfireHydrants: CityFireHydrantForList[] = [];
    private idBuilding : string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private controller: BuildingFireHydrantRepositoryProvider,
              private messageTools: MessageToolsProvider)
  {
      this.idBuilding = this.navParams.get('idBuilding');
      this.LoadCityFireHydrant(navParams.get('idCity'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CityFireHydrantPage');
  }

  private LoadCityFireHydrant(idcity : string) {
      this.controller.getCityFireHydrantListForBuilding(idcity, this.idBuilding)
          .subscribe(result => this.cityfireHydrants = result);
  }

  private onAddHydrant(idFireHydrant : string)
  {
      this.AddBuildingFireHydrant(this.idBuilding, idFireHydrant);
  }
  private AddBuildingFireHydrant(idBuilding : string, idFireHydrant : string)  {
    this.controller.addBuildingFireHydrant(idBuilding, idFireHydrant)
        .subscribe(result => {
            if (result) {
                this.navCtrl.pop();
            } else {
                this.messageTools.showToast("Erreur lors de l'ajout de borne" + result);
            }
        })
  }
  private onCancelClick(){
      this.navCtrl.pop();
  }
}
