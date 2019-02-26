import {Injectable} from '@angular/core';
import {InspectionBuildingFireProtectionForList} from '../../models/inspection-building-fire-protection-for-list';
import {InspectionBuildingAlarmPanel} from '../../models/inspection-building-alarm-panel';
import {Storage as OfflineStorage} from "@ionic/storage";
import {GenericType} from "../../models/generic-type";

@Injectable()
export class InspectionBuildingAlarmPanelRepositoryProvider {

  private types: GenericType[] = [];

  constructor(private storage: OfflineStorage) {
    }

  public async getList(idBuilding: string): Promise<InspectionBuildingFireProtectionForList[]> {
    this.types = (await this.storage.get('alarm_panel_type')).data;
    return this.storage.get('building_alarm_panels_' + idBuilding)
      .then(sprinklers =>sprinklers.map(m => this.getForList(m)));
  }

  private getForList(panel: InspectionBuildingAlarmPanel): InspectionBuildingFireProtectionForList{
    const item = new InspectionBuildingFireProtectionForList();
    item.id = panel.id;
    let sector = '';
    let floor = '';

    if (panel.sector != '')
      sector = 'Secteur: ' + panel.sector + '.';
    if (panel.floor != '')
      floor = 'Étage: ' + panel.floor + '.';

    item.locationDescription = sector + floor;
    item.typeDescription = this.types.filter(type => type.id == panel.idAlarmPanelType)[0].name;
    return item;
  }

  public async get(idBuilding: string, idBuildingSprinkler: string): Promise<InspectionBuildingAlarmPanel> {
    return (await this.storage.get('building_alarm_panels_' + idBuilding)).data.filter(sprinkler => sprinkler.id == idBuildingSprinkler)[0];
  }

  public async save(panel: InspectionBuildingAlarmPanel): Promise<any> {
    const currentPanels = await this.storage.get('building_alarm_panels_' + panel.idBuilding);
    const currentPanel = currentPanels.filter(s => s.id == panel.id)[0];
    Object.assign(currentPanel, panel);
    currentPanel.hasBeenModified = true;

    return this.storage.set('building_alarm_panels_' + currentPanel.idBuilding, currentPanels);
  }

  public async delete(panel: InspectionBuildingAlarmPanel): Promise<any> {
    const currentPanels = await this.storage.get('building_alarm_panels_' + panel.idBuilding);
    const currentPanel = currentPanels.filter(s => s.id == panel.id)[0];
    currentPanel.hasBeenModified = true;
    currentPanel.isActive = false;

    return this.storage.set('building_alarm_panels_' + currentPanel.idBuilding, currentPanel);
  }
}
