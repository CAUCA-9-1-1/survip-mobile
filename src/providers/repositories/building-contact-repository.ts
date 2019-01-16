import {Injectable} from '@angular/core';
import {InspectionBuildingContact} from '../../models/inspection-building-contact';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class BuildingContactRepositoryProvider {

    private baseKey: string = 'building_contacts_';

    constructor(private storage: OfflineStorage) {
    }

    public getList(idBuilding: string): Promise<InspectionBuildingContact[]> {
      return this.storage.get(this.baseKey + idBuilding);
    }

    public async get(idBuilding: string, idBuildingContact: string): Promise<InspectionBuildingContact> {
        return (await this.storage.get(this.baseKey  + idBuilding)).filter(c => c.id == idBuildingContact)[0];
    }

    public async save(modifiedItem: InspectionBuildingContact): Promise<any> {

      const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
      const currentItem = list.filter(s => s.id == modifiedItem.id)[0];
      Object.assign(currentItem, modifiedItem);
      currentItem.hasBeenModified = true;

      return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
    }

    public async delete(modifiedItem: InspectionBuildingContact): Promise<any> {

      const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
      const currentItem = list.filter(s => s.id == modifiedItem.id)[0];
      Object.assign(currentItem, modifiedItem);
      currentItem.isActive = false;
      currentItem.hasBeenModified = true;

      return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
    }
}
