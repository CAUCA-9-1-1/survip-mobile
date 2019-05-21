import {Injectable} from '@angular/core';
import {InspectionBuildingDetail} from '../../models/inspection-building-detail';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class BuildingDetailRepositoryProvider {

  private baseKey: string = 'building_detail_';

  constructor(private storage: OfflineStorage) {
  }

  public get(idBuilding: string): Promise<InspectionBuildingDetail> {
    return this.storage.get(this.baseKey  + idBuilding);
  }

  public async save(modifiedItem: InspectionBuildingDetail): Promise<any> {

    const item = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
    Object.assign(item, modifiedItem);
    item.hasBeenModified = true;

    return this.storage.set(this.baseKey  + modifiedItem.idBuilding, item);
  }

  public getEnumsKeysCollection(enumCollection: any): number[] {
    return Object.keys(enumCollection)
      .map(k => enumCollection[k])
      .filter(v => typeof v === "number") as number[];
  }
}
