import { Injectable } from '@angular/core';
import {Storage as OfflineStorage} from "@ionic/storage";
import {InspectionWithBuildingsList} from "../../models/inspection-with-buildings-list";
import {HttpService} from "../Base/http.service";

@Injectable()
export class InspectionUploaderProvider {

  constructor(
    private httpService: HttpService,
    private storage: OfflineStorage
  ) {
  }

  public async uploadInspection(idInspection: string): Promise<boolean> {
    const inspection: InspectionWithBuildingsList = await this.storage.get('inspection_buildings_' + idInspection);
    if (inspection != null) {
      const promises: Promise<boolean>[] = [];
      inspection.buildings.forEach(building => {
        promises.push(this.saveEntity(building.idBuilding, 'building_detail_', 'detail'));
        promises.push(this.saveEntities(building.idBuilding, 'building_contacts_', 'contact'));
        promises.push(this.saveEntities(building.idBuilding, 'building_hazardous_materials_', 'hazardousmaterial'));
        promises.push(this.saveEntities(building.idBuilding, 'building_pnaps_', 'pnaps'));
        promises.push(this.saveEntities(building.idBuilding, 'building_sprinklers_', 'sprinkler'));
        promises.push(this.saveEntities(building.idBuilding, 'building_alarm_panels_', 'alarmpanel'));
        promises.push(this.saveEntities(building.idBuilding, 'building_anomalies_', 'anomaly'));
        promises.push(this.saveEntity(building.idBuilding, 'building_particular_risk_wall_', 'particularrisk/wall'));
        promises.push(this.saveEntity(building.idBuilding, 'building_particular_risk_foundation_', 'particularrisk/foundation'));
        promises.push(this.saveEntity(building.idBuilding, 'building_particular_risk_floor_', 'particularrisk/floor'));
        promises.push(this.saveEntity(building.idBuilding, 'building_particular_risk_roof_', 'particularrisk/roof'));
      });
      return await Promise.all(promises)
        .then(responses => responses.every(r => r))
    } else {
      return false;
    }
  }

  /*private async saveDetail(idBuilding: string): Promise<boolean> {
    const detail = await this.storage.get('building_detail_' + idBuilding);
    if (detail.hasBeenModified) {
      const hasBeenSaved = await this.sendToApi(detail, 'detail');
      if (hasBeenSaved) {
        detail.hasBeenModified = false;
        await this.storage.set('building_detail_' + idBuilding, detail);
      }
      return hasBeenSaved;
    } else {
      return true;
    }
  }*/

  private async saveEntities(idBuilding: string, key: string, url: string): Promise<boolean> {
    const entities = await this.storage.get(key + idBuilding);
    if (entities != null && entities.length > 0) {
      const modifiedEntities = entities.filter(entity => entity.hasBeenModified);
      const promises: Promise<boolean>[] = [];
      modifiedEntities.forEach(entity => promises.push(this.saveSingleEntity(entity, url)));
      if (await Promise.all(promises)
        .then(responses => responses.every(r => r))) {
        await this.storage.set(key + idBuilding, entities);
        console.log('saved', key, url);
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  private async saveSingleEntity(entity, url: string): Promise<boolean> {
    const hasBeenSaved = await this.sendToApi(entity, url);
    if (hasBeenSaved) {
      entity.hasBeenModified = false;
      return true;
    } else {
      return false;
    }
  }

  private async saveEntity(idBuilding: string, key: string, url: string): Promise<boolean> {
    const entity = await this.storage.get(key + idBuilding);
    if (entity.hasBeenModified) {
      const hasBeenSaved = await this.sendToApi(entity, url);
      if (hasBeenSaved) {
        entity.hasBeenModified = false;
        await this.storage.set(key + idBuilding, entity);
        console.log('saved', key, url);
      }
      return hasBeenSaved;
    } else {
      return true;
    }
  }

  private sendToApi(entity, url: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.httpService.post('inspection/building/' + url + '/', JSON.stringify(entity))
        .subscribe(
          () => resolve(true),
          () => resolve(false)
        );
    });
  }
}
