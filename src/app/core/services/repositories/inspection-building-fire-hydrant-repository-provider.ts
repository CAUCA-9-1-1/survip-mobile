import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { InspectionBuildingFireHydrantForList } from 'src/app/shared/models/inspection-building-fire-hydrant-for-list';
import { CityFireHydrantForList } from 'src/app/shared/models/city-fire-hydrant-for-list';
import {UUID} from 'angular2-UUID';

@Injectable({providedIn: 'root'})
export class InspectionBuildingFireHydrantRepositoryProvider {
  private baseKey = 'building_fire_hydrants_';

  constructor(private storage: OfflineStorage) {
  }

  public async getList(idBuilding: string): Promise<InspectionBuildingFireHydrantForList[]> {
    const data = await this.storage.get(this.baseKey + idBuilding);
    return data.filter(h => h.isActive !== false);
  }

  public async getListAvailableForBuilding(idBuilding: string): Promise<CityFireHydrantForList[]> {
    const currentList = await this.getList(idBuilding);
    const availableList: CityFireHydrantForList[] = await this.storage.get('fire_hydrant_for_building_' + idBuilding);
    const finalList: CityFireHydrantForList[] = [];
    availableList.forEach(hydrant => {
      if (currentList.find(item => item.idFireHydrant === hydrant.id) == null) {
        finalList.push(hydrant);
      }
    });
    return finalList;
  }

  public async addFireHydrant(idBuilding: string, hydrant: CityFireHydrantForList): Promise<boolean> {
    const list = await this.getList(idBuilding);
    if (list.every(item => item.idFireHydrant !== hydrant.id)) {
      const item = new InspectionBuildingFireHydrantForList();
      item.id = UUID.UUID();
      item.idFireHydrant = hydrant.id;
      item.address = hydrant.address;
      item.number = hydrant.number;
      item.color = hydrant.color;
      item.isActive = true;
      item.hasBeenModified = true;
      list.push(item);
      return this.storage.set(this.baseKey + idBuilding, list);
    }
    return true;
  }

  public async deleteFireHydrant(idBuilding: string, idFireHydrant: string) {
    const list = await this.getList(idBuilding);
    const item = list.find(hydrant => hydrant.idFireHydrant === idFireHydrant);
    if (item != null) {
      item.isActive = false;
      item.hasBeenModified = true;
      return this.storage.set(this.baseKey + idBuilding, list);
    }
    return true;
  }
}
