import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CityFireHydrantForList} from "../../models/city-fire-hydrant-for-list";
import {InspectionBuildingFireHydrantRepositoryProvider} from "../../providers/repositories/inspection-building-fire-hydrant-repository-provider";

@IonicPage()
@Component({
    selector: 'page-city-fire-hydrant',
    templateUrl: 'city-fire-hydrant.html',
})
export class CityFireHydrantPage {
  private readonly idBuilding: string;
  private readonly idCity = "";

  public cityFireHydrants: CityFireHydrantForList[] = [];
  public filteredCityFireHydrantList: CityFireHydrantForList[] = [];
  public editMode = false;
  public editModeColor = "whitesmoke";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private repo: InspectionBuildingFireHydrantRepositoryProvider) {
    this.idBuilding = this.navParams.get('idBuilding');
    this.idCity = navParams.get('idCity');
  }

  public ionViewDidEnter() {
    this.loadCityFireHydrant();
  }

  private getItems(ev: any) {
    this.filteredCityFireHydrantList = [];
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.filteredCityFireHydrantList = this.cityFireHydrants.filter((item) => {
        return ((item.address.toLowerCase().indexOf(val.toLowerCase()) > -1) || (item.number.toLowerCase().indexOf(val.toLowerCase()) > -1));
      });
    } else {
      this.filteredCityFireHydrantList = this.cityFireHydrants;
    }
  }

  private loadCityFireHydrant() {
    this.repo.getListAvailableForBuilding(this.idBuilding)
      .then(hydrants => this.cityFireHydrants = this.filteredCityFireHydrantList = hydrants);
  }

  private async addBuildingFireHydrant(hydrant: CityFireHydrantForList) {
    if (!this.editMode) {
      await this.repo.addFireHydrant(this.idBuilding, hydrant);
      await this.navCtrl.pop();
    } else {
      await this.navCtrl.push('FireHydrantPage', {id: hydrant.id, idCity: this.idCity});
    }
  }
/*
  public createFireHydrant() {
    this.navCtrl.push('FireHydrantPage', {idCity: this.idCity});
  }

  public onEditModeChanged() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editModeColor = "white";
    } else {
      this.editModeColor = "#B32017";
    }
  }*/
}