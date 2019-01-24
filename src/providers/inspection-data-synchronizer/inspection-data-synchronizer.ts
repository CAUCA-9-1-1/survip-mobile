import { Injectable } from '@angular/core';
import {BaseDataSynchronizerProvider} from "../base-data-synchronizer-provider";
import {Batch} from "../../models/batch";
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {InspectionWithBuildingsList} from "../../models/inspection-with-buildings-list";
import {Observable} from "rxjs";
import {InspectionBuildingDetail} from "../../models/inspection-building-detail";
import {InspectionBuildingContact} from "../../models/inspection-building-contact";
import {InspectionBuildingHazardousMaterial} from "../../models/inspection-building-hazardous-material";
import {InspectionBuildingPersonRequiringAssistance} from "../../models/inspection-building-person-requiring-assistance";
import {InspectionBuildingSprinkler} from "../../models/inspection-building-sprinkler";
import {InspectionBuildingAlarmPanel} from "../../models/inspection-building-alarm-panel";
import {InspectionBuildingCourse} from "../../models/inspection-building-course";
import {map} from "rxjs/operators";
import {InspectionPictureForWeb} from "../../models/inspection-picture-for-web";
import {InspectionBuildingAnomaly, InspectionBuildingAnomalyPictures} from "../../models/inspection-building-anomaly";
import {InspectionBuildingParticularRisk} from "../../models/inspection-building-particular-risk";

@Injectable()
export class InspectionDataSynchronizerProvider extends BaseDataSynchronizerProvider<Batch[]> {

  constructor(
    private service: HttpService,
    private storage: OfflineStorage) {
    super(service, storage, 'batches', 'inspection')
  }

  public downloadInspection(idInspection: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.getInspection(idInspection)
        .subscribe(
          async (data: InspectionWithBuildingsList) => {
            await this.saveInspection(data);
            const idBuildings: string[] = data.buildings.map(building => building.idBuilding);
            resolve(await Promise.all(this.downloadBuildingsData(idBuildings))
              .then(responses => responses.every(r => r)));
          },
          async () => resolve(false)
        );
    });
  }

  public getInspection(idInspection: string): Observable<InspectionWithBuildingsList>{
    return this.service.get('inspection/' + idInspection + '/buildinglist')
      .pipe(map(response => response));
  }

  private saveInspection(inspection: InspectionWithBuildingsList) : Promise<boolean>{
    return this.storage.set('inspection_buildings_' + inspection.id, inspection);
  }

  private downloadBuildingsData(idBuildings: string[]): Promise<boolean>[]{

    const promises: Promise<boolean>[] = [];

    for(let idBuilding of idBuildings){
      promises.push(this.downloadData<InspectionBuildingDetail>(idBuilding, 'inspection/building/' + idBuilding + '/detail', 'building_detail_'));
      promises.push(this.downloadData<InspectionBuildingContact[]>(idBuilding, 'inspection/building/' + idBuilding + '/contactList', 'building_contacts_'));
      promises.push(this.downloadData<InspectionBuildingHazardousMaterial[]>(idBuilding, 'inspection/building/' + idBuilding + '/hazardousMaterialList', 'building_hazardous_materials_'));
      promises.push(this.downloadDataAndSaveAsArray<InspectionPictureForWeb>(idBuilding, 'inspection/building/' + idBuilding + '/detail/picture', 'building_plan_picture_'));
      promises.push(this.downloadData<InspectionBuildingPersonRequiringAssistance[]>(idBuilding, 'inspection/building/' + idBuilding + '/pnapsList', 'building_pnaps_'));
      promises.push(this.downloadData<InspectionBuildingSprinkler[]>(idBuilding, 'inspection/building/' + idBuilding + '/sprinklerList', 'building_sprinklers_'));
      promises.push(this.downloadData<InspectionBuildingAlarmPanel[]>(idBuilding, 'inspection/building/' + idBuilding + '/alarmPanelList', 'building_alarm_panels_'));
      promises.push(this.downloadData<InspectionBuildingCourse[]>(idBuilding, 'inspection/' + idBuilding + '/listCourse', 'building_courses_'));
      promises.push(this.downloadData<InspectionBuildingAnomaly[]>(idBuilding, 'inspection/building/' + idBuilding + '/anomalyWithoutPicture', 'building_anomalies_'));
      promises.push(this.downloadData<InspectionBuildingParticularRisk>(idBuilding, 'inspection/building/' + idBuilding + '/ParticularRisk/floor', 'building_particular_risk_floor_'));
      promises.push(this.downloadData<InspectionBuildingParticularRisk>(idBuilding, 'inspection/building/' + idBuilding + '/ParticularRisk/foundation', 'building_particular_risk_foundation_'));
      promises.push(this.downloadData<InspectionBuildingParticularRisk>(idBuilding, 'inspection/building/' + idBuilding + '/ParticularRisk/wall', 'building_particular_risk_wall_'));
      promises.push(this.downloadData<InspectionBuildingParticularRisk>(idBuilding, 'inspection/building/' + idBuilding + '/ParticularRisk/roof', 'building_particular_risk_roof_'));
      promises.push(this.downloadDataAndSavePicturesByParent('inspection/building/' + idBuilding + '/anomaly/pictures', 'building_anomaly_pictures_'));
      promises.push(this.downloadDataAndSavePicturesByParent('inspection/building/' + idBuilding + '/ParticularRisk/pictures', 'building_particular_risk_pictures_'));
    }
    return promises;
  }

  private downloadData<T>(idBuilding: string, url: string, key: string): Promise<boolean>{
    return new Promise((resolve) => {
      this.getDataFromApi<T>(url)
        .subscribe(
          async (data: T) => {
            await this.saveData<T>(data, idBuilding, key);
            resolve(true);
          },
          async () => resolve(false)
        );
    });
  }

  private downloadDataAndSavePicturesByParent(url: string, key: string): Promise<boolean>{
    return new Promise((resolve) => {
      this.getDataFromApi<InspectionBuildingAnomalyPictures[]>(url)
        .subscribe(
          async (data: InspectionBuildingAnomalyPictures[]) => {
            console.log('url', data);
            data.forEach(async(anomaly) => {
              await this.saveData<InspectionPictureForWeb[]>(anomaly.pictures, anomaly.id, key);
            });
            resolve(true);
          },
          async () => resolve(false)
        );
    });
  }

  private downloadDataAndSaveAsArray<T>(idBuilding: string, url: string, key: string): Promise<boolean>{
    return new Promise((resolve) => {
      this.getDataFromApi<T>(url)
        .subscribe(
          async (data: T) => {
            if (data != null) {
              await this.saveData<T[]>([data], idBuilding, key);
            }
            resolve(true);
          },
          async () => resolve(false)
        );
    });
  }

  private getDataFromApi<T>(url: string): Observable<T>{
    return this.service.get(url)
      .pipe(map(response => response));
  }

  private saveData<T>(data: T, id: string, key: string) : Promise<boolean>{
    return this.storage.set(key + id, data);
  }
}
