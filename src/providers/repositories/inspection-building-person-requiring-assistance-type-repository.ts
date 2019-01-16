import {Injectable} from '@angular/core';
import {InspectionBuildingPersonRequiringAssistanceForList} from '../../models/inspection-building-person-requiring-assistance-for-list';
import {InspectionBuildingPersonRequiringAssistance} from '../../models/inspection-building-person-requiring-assistance';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider {

  private baseKey: string = 'building_pnaps_';

  constructor(private storage: OfflineStorage) {
  }

  public getList(idBuilding: string): Promise<InspectionBuildingPersonRequiringAssistanceForList[]> {
    return this.storage.get(this.baseKey + idBuilding)
      .then(items =>items.map(item => this.getForList(item)));
  }

  private getForList(pnap: InspectionBuildingPersonRequiringAssistance):InspectionBuildingPersonRequiringAssistanceForList {
    const item = new InspectionBuildingPersonRequiringAssistanceForList();
    item.id = pnap.id;
    item.name = pnap.personName;
    item.typeDescription = pnap.idPersonRequiringAssistanceType;
    return item;
  }

  public async get(idBuilding: string, idBuildingContact: string): Promise<InspectionBuildingPersonRequiringAssistance> {
    return (await this.storage.get(this.baseKey  + idBuilding)).filter(c => c.id == idBuildingContact)[0];
  }

  public async save(modifiedItem: InspectionBuildingPersonRequiringAssistance): Promise<any> {

    const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
    const currentItem = list.filter(s => s.id == modifiedItem.id)[0];
    Object.assign(currentItem, modifiedItem);
    currentItem.hasBeenModified = true;

    return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
  }

  public async delete(modifiedItem: InspectionBuildingPersonRequiringAssistance): Promise<any> {

    const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
    const currentItem = list.filter(s => s.id == modifiedItem.id)[0];
    Object.assign(currentItem, modifiedItem);
    currentItem.isActive = false;
    currentItem.hasBeenModified = true;

    return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
  }

  public getEnumsKeysCollection(enumCollection: any): number[] {
    return Object.keys(enumCollection)
      .map(k => enumCollection[k])
      .filter(v => typeof v === "number") as number[];
  }
}

