import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import {UnitOfMeasureRepositoryProvider} from './unit-of-measure-repository';
import {HazardousMaterialRepositoryProvider} from './hazardous-material-repository';
import { InspectionBuildingHazardousMaterialForList } from 'src/app/shared/models/inspection-building-hazardous-material-for-list';
import { InspectionBuildingHazardousMaterial } from 'src/app/shared/models/inspection-building-hazardous-material';
import { UnitOfMeasure } from 'src/app/shared/models/unit-of-measure';
import { HazardousMaterialForList } from 'src/app/shared/models/hazardous-material-for-list';

@Injectable({providedIn: 'root'})
export class InspectionBuildingHazardousMaterialRepositoryProvider {

  private baseKey: string = 'building_hazardous_materials_';

  constructor(
    private storage: OfflineStorage,
    private unitRepo: UnitOfMeasureRepositoryProvider,
    private materialRepo: HazardousMaterialRepositoryProvider
  ) {
  }

  public async getList(idBuilding: string): Promise<InspectionBuildingHazardousMaterialForList[]> {
    const units = await this.unitRepo.getAllForCapacity();
    const materials = await this.materialRepo.getAll();

    return this.storage.get(this.baseKey + idBuilding)
      .then(items => items.filter(item => item.isActive).map(item => this.getForList(item, units, materials)));
  }

  private getForList(
    material: InspectionBuildingHazardousMaterial,
    units: UnitOfMeasure[],
    materials: HazardousMaterialForList[]): InspectionBuildingHazardousMaterialForList {
    const item = new InspectionBuildingHazardousMaterialForList();
    item.id = material.id;

    if (material.capacityContainer > 0) {
      item.quantityDescription = material.capacityContainer.toString();
      const unit = units.find(u => u.id === material.idUnitOfMeasure);
      if (unit != null) {
        item.quantityDescription += ' ' + unit.name;
      }
      if (material.quantity > 0) {
        item.quantityDescription = material.quantity + ' x ' + item.quantityDescription;
      }
    }

    const foundMaterial = materials.find(mat => mat.id === material.idHazardousMaterial);
    item.hazardousMaterialName = foundMaterial.name;
    item.hazardousMaterialNumber = foundMaterial.number;
    return item;
  }

  public async get(idBuilding: string, idBuildingContact: string): Promise<InspectionBuildingHazardousMaterial> {
    return (await this.storage.get(this.baseKey  + idBuilding)).find(c => c.id === idBuildingContact);
  }

  public async save(modifiedItem: InspectionBuildingHazardousMaterial): Promise<any> {

    const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
    const currentItem = this.getCurrentItem(list, modifiedItem);
    currentItem.hasBeenModified = true;

    return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
  }

  public async delete(modifiedItem: InspectionBuildingHazardousMaterial): Promise<any> {

    const list = await this.storage.get(this.baseKey  + modifiedItem.idBuilding);
    const currentItem = list.filter(s => s.id === modifiedItem.id)[0];
    Object.assign(currentItem, modifiedItem);
    currentItem.isActive = false;
    currentItem.hasBeenModified = true;

    return this.storage.set(this.baseKey  + modifiedItem.idBuilding, list);
  }

  public getEnumsKeysCollection(enumCollection: any): number[] {
    return Object.keys(enumCollection)
      .map(k => enumCollection[k])
      .filter(v => typeof v === 'number') as number[];
  }


  private getCurrentItem(
    list: InspectionBuildingHazardousMaterial[],
    modifiedItem: InspectionBuildingHazardousMaterial): InspectionBuildingHazardousMaterial {
    const currentItem = list.filter(s => s.id === modifiedItem.id)[0];
    if (currentItem == null) {
      list.push(modifiedItem);
    } else {
      Object.assign(currentItem, modifiedItem);
    }
    return currentItem || modifiedItem;
  }
}
