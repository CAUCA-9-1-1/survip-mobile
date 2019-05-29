import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CityFireHydrantForList } from 'src/app/shared/models/city-fire-hydrant-for-list';
import { InspectionBuildingFireHydrantRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-fire-hydrant-repository-provider';

@Component({
  selector: 'app-city-fire-hydrants',
  templateUrl: './city-fire-hydrants.component.html',
  styleUrls: ['./city-fire-hydrants.component.scss'],
})
export class CityFireHydrantsComponent implements OnInit {

  private readonly idBuilding: string;
  private readonly idCity = '';

  public cityFireHydrants: CityFireHydrantForList[] = [];
  public filteredCityFireHydrantList: CityFireHydrantForList[] = [];
  public editMode = false;
  public editModeColor = 'whitesmoke';


  constructor(
    private modalController: ModalController,
    public navParams: NavParams,
    private repo: InspectionBuildingFireHydrantRepositoryProvider
  ) {
    this.idBuilding = this.navParams.get('idBuilding');
    this.idCity = navParams.get('idCity');
  }

  ngOnInit() {
    this.loadCityFireHydrant();
  }

  private loadCityFireHydrant() {
    this.repo.getListAvailableForBuilding(this.idBuilding)
      .then(hydrants => this.cityFireHydrants = this.filteredCityFireHydrantList = hydrants);
  }

  private async addBuildingFireHydrant(hydrant: CityFireHydrantForList) {
    await this.repo.addFireHydrant(this.idBuilding, hydrant);
    await this.modalController.dismiss();
  }
}
