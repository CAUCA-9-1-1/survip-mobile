import {Injectable} from '@angular/core';
import {InspectionBuildingFireProtectionForList} from '../../models/inspection-building-fire-protection-for-list';
import {InspectionBuildingSprinkler} from '../../models/inspection-building-sprinkler';
import {Storage as OfflineStorage} from "@ionic/storage";
import {GenericType} from "../../models/generic-type";

@Injectable()
export class InspectionBuildingSprinklerRepositoryProvider {

  private types: GenericType[] = [];

  constructor(private storage: OfflineStorage) {
    }

    public async getList(idBuilding: string): Promise<InspectionBuildingFireProtectionForList[]> {
        this.types = (await this.storage.get('sprinkler_type')).data;
        return this.storage.get('building_sprinklers_' + idBuilding)
          .then(sprinklers =>sprinklers.filter(m => m.isActive).map(m => this.getForList(m)));
    }

    private getForList(sprinkler: InspectionBuildingSprinkler): InspectionBuildingFireProtectionForList{
      const item = new InspectionBuildingFireProtectionForList();
      item.id = sprinkler.id;
      let wall = '';
      let sector = '';
      let floor = '';

      if (sprinkler.wall != '')
        wall = 'Mur: ' + sprinkler.wall + '.';
      if (sprinkler.sector != '')
        sector = 'Secteur: ' + sprinkler.sector + '.';
      if (sprinkler.floor != '')
        floor = 'Étage: ' + sprinkler.floor + '.';

      item.locationDescription = wall + sector + floor;
      item.typeDescription = this.types.filter(type => type.id == sprinkler.idSprinklerType)[0].name;
      return item;
    }

    public async get(idBuilding: string, idBuildingSprinkler: string): Promise<InspectionBuildingSprinkler> {
        return (await this.storage.get('building_sprinklers_' + idBuilding)).filter(sprinkler => sprinkler.id == idBuildingSprinkler)[0];
    }

    public async save(sprinkler: InspectionBuildingSprinkler): Promise<any> {
        const currentSprinklers = await this.storage.get('building_sprinklers_' + sprinkler.idBuilding);
        const currentSprinkler = this.getCurrentItem(currentSprinklers, sprinkler);
        currentSprinkler.hasBeenModified = true;

        return this.storage.set('building_sprinklers_' + currentSprinkler.idBuilding, currentSprinklers);
    }

    public async delete(sprinkler: InspectionBuildingSprinkler): Promise<any> {
      const currentSprinklers = await this.storage.get('building_sprinklers_' + sprinkler.idBuilding);
      const currentSprinkler = currentSprinklers.filter(s => s.id == sprinkler.id)[0];
      currentSprinkler.hasBeenModified = true;
      currentSprinkler.isActive = false;

      return this.storage.set('building_sprinklers_' + currentSprinkler.idBuilding, currentSprinklers);
    }

  private getCurrentItem(list: InspectionBuildingSprinkler[], modifiedItem: InspectionBuildingSprinkler): InspectionBuildingSprinkler{
    let currentItem = list.filter(s => s.id == modifiedItem.id)[0];
    if (currentItem == null) {
      list.push(modifiedItem);
    }else{
      Object.assign(currentItem, modifiedItem);
    }
    return currentItem || modifiedItem;
  }
}


