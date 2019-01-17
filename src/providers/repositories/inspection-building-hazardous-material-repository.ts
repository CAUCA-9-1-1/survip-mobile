import {Injectable} from '@angular/core';
import {InspectionBuildingHazardousMaterialForList} from '../../models/inspection-building-hazardous-material-for-list';
import {InspectionBuildingHazardousMaterial} from '../../models/inspection-building-hazardous-material';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class InspectionBuildingHazardousMaterialRepositoryProvider {

  private baseKey: string = 'building_hazardous_materials_';

  constructor(private storage: OfflineStorage) {
  }

  public getList(idBuilding: string): Promise<InspectionBuildingHazardousMaterialForList[]> {
    return this.storage.get(this.baseKey + idBuilding)
      .then(items =>items.filter(item => item.isActive).map(item => this.getForList(item)));
  }

  private getForList(material: InspectionBuildingHazardousMaterial):InspectionBuildingHazardousMaterialForList {
    const item = new InspectionBuildingHazardousMaterialForList();
    item.id = material.id;
    item.hazardousMaterialName = material.idHazardousMaterial;
    item.quantityDescription = material.quantity + ' x ' + material.idUnitOfMeasure;
    return item;
  }

  public async get(idBuilding: string, idBuildingContact: string): Promise<InspectionBuildingHazardousMaterial> {
    return (await this.storage.get(this.baseKey  + idBuilding)).filter(c => c.id == idBuildingContact)[0];
  }

  public async save(modifiedItem: InspectionBuildingHazardousMaterial): Promise<any> {

    const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
    const currentItem = this.getCurrentItem(list, modifiedItem);
    currentItem.hasBeenModified = true;

    return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
  }

  public async delete(modifiedItem: InspectionBuildingHazardousMaterial): Promise<any> {

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


  private getCurrentItem(list: InspectionBuildingHazardousMaterial[], modifiedItem: InspectionBuildingHazardousMaterial): InspectionBuildingHazardousMaterial{
    let currentItem = list.filter(s => s.id == modifiedItem.id)[0];
    if (currentItem == null) {
      list.push(modifiedItem);
    }else{
      Object.assign(currentItem, modifiedItem);
    }
    return currentItem || modifiedItem;
  }
}
