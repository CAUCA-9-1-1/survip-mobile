import {Injectable} from '@angular/core';
import {InspectionBuildingAnomaly} from '../../models/inspection-building-anomaly';
import {InspectionBuildingAnomalyThemeForList} from '../../models/inspection-building-anomaly-theme-for-list';
import {Storage as OfflineStorage} from "@ionic/storage";
import {ExpiringCache} from "../expiring-cache";

@Injectable()
export class InspectionBuildingAnomalyRepositoryProvider {

  constructor(private storage: OfflineStorage) {
  }

  public async getList(idBuilding: string): Promise<InspectionBuildingAnomalyThemeForList[]> {
    const anomalies = (await this.storage.get('building_anomalies_' + idBuilding))
      .filter(anomaly => anomaly.isActive);

    const groups: InspectionBuildingAnomalyThemeForList[] = [];

    anomalies.forEach((anomaly) => {
      let group = groups.find(group => group.theme == anomaly.theme);
      if (group == null) {
        group = new InspectionBuildingAnomalyThemeForList();
        group.theme = anomaly.theme;
        group.anomalies = [];
        groups.push(group);
      }
      group.anomalies.push(anomaly);
    });
    return groups;
  }

  public async getThemes(): Promise<string[]> {
    return (await this.storage.get('anomaly_themes')).data;
  }

  public async get(idBuilding, idBuildingAnomaly: string): Promise<InspectionBuildingAnomaly> {
    return (await this.storage.get('building_anomalies_' + idBuilding))
      .find(anomaly => anomaly.id == idBuildingAnomaly);
  }

  public async save(anomaly: InspectionBuildingAnomaly): Promise<any> {

    await this.addThemeWhenNew(anomaly);
    const currentItems = await this.storage.get('building_anomalies_' + anomaly.idBuilding);
    const currentItem = this.getCurrentItem(currentItems, anomaly);
    currentItem.hasBeenModified = true;

    return this.storage.set('building_anomalies_' + currentItem.idBuilding, currentItems);
  }

  private async addThemeWhenNew(anomaly: InspectionBuildingAnomaly) {
    const themes: ExpiringCache<string[]> = await this.storage.get('anomaly_themes');
    if (!themes.data.some(theme => theme == anomaly.theme)) {
      themes.data.push(anomaly.theme);
      await this.storage.set('anomaly_themes', themes);
    }
  }

  public async delete(anomaly: InspectionBuildingAnomaly): Promise<any> {
    const currentItems = await this.storage.get('building_anomalies_' + anomaly.idBuilding);
    const currentItem = currentItems.filter(s => s.id == anomaly.id)[0];
    currentItem.hasBeenModified = true;
    currentItem.isActive = false;

    return this.storage.set('building_anomalies_' + anomaly.idBuilding, currentItems);
  }

  private getCurrentItem(list: InspectionBuildingAnomaly[], modifiedItem: InspectionBuildingAnomaly): InspectionBuildingAnomaly {
    let currentItem = list.filter(s => s.id == modifiedItem.id)[0];
    if (currentItem == null) {
      list.push(modifiedItem);
    } else {
      Object.assign(currentItem, modifiedItem);
    }
    return currentItem || modifiedItem;
  }
}

