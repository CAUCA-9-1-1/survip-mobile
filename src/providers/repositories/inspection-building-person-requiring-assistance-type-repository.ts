import {Injectable} from '@angular/core';
import {InspectionBuildingPersonRequiringAssistanceForList} from '../../models/inspection-building-person-requiring-assistance-for-list';
import {InspectionBuildingPersonRequiringAssistance} from '../../models/inspection-building-person-requiring-assistance';
import {Storage as OfflineStorage} from "@ionic/storage";
import {PersonRequiringAssistanceTypeRepositoryProvider} from "./person-requiring-assistance-type-repository";
import {GenericType} from "../../models/generic-type";

@Injectable()
export class InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider {

  private baseKey: string = 'building_pnaps_';

  constructor(private storage: OfflineStorage, private typesRepo: PersonRequiringAssistanceTypeRepositoryProvider) {
  }

  public async getList(idBuilding: string): Promise<InspectionBuildingPersonRequiringAssistanceForList[]> {
    const types = await this.typesRepo.getAll();

    return this.storage.get(this.baseKey + idBuilding)
      .then(items =>items.filter(item => item.isActive).map(item => this.getForList(types, item)));
  }

  private getForList(types: GenericType[], pnap: InspectionBuildingPersonRequiringAssistance):InspectionBuildingPersonRequiringAssistanceForList {
    const item = new InspectionBuildingPersonRequiringAssistanceForList();
    item.id = pnap.id;
    item.name = pnap.personName;
    const foundType = types.filter(type => type.id == pnap.idPersonRequiringAssistanceType)[0];
    item.typeDescription = foundType != null ? foundType.name : '';
    return item;
  }

  public async get(idBuilding: string, idPnap: string): Promise<InspectionBuildingPersonRequiringAssistance> {
    return (await this.storage.get(this.baseKey  + idBuilding)).filter(c => c.id == idPnap)[0];
  }

  public async save(modifiedItem: InspectionBuildingPersonRequiringAssistance): Promise<any> {

    const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
    const currentItem = this.getCurrentItem(list, modifiedItem);
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

  private getCurrentItem(list: InspectionBuildingPersonRequiringAssistance[], modifiedItem: InspectionBuildingPersonRequiringAssistance): InspectionBuildingPersonRequiringAssistance{
    let currentItem = list.filter(s => s.id == modifiedItem.id)[0];
    if (currentItem == null) {
      list.push(modifiedItem);
    }else{
      Object.assign(currentItem, modifiedItem);
    }
    return currentItem || modifiedItem;
  }
}

