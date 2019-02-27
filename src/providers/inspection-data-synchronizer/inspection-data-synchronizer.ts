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
import {InspectionBuildingFireHydrantForList} from "../../models/inspection-building-fire-hydrant-for-list";
import {CityFireHydrantForList} from "../../models/city-fire-hydrant-for-list";
import {InspectionSurveyAnswer} from "../../models/inspection-survey-answer";

@Injectable()
export class InspectionDataSynchronizerProvider extends BaseDataSynchronizerProvider<Batch[]> {

  constructor(
    private service: HttpService,
    private storage: OfflineStorage) {
    super(service, storage, 'batches', 'inspection')
  }

  public synchronizeAll(): Promise<boolean> {

    return new Promise((resolve) => {
      this.service.get(this.baseUrl)
        .pipe(map(response => response))
        .subscribe(
          async (data: Batch[]) => {
            await this.removeCacheForRemovedInspections(data);
            await this.saveValueToStorage(data);
            resolve(true);
          },
          async () => resolve(await this.valueIsCached())
        );
    });
  }

  private async removeCacheForRemovedInspections(updatedBatches: Batch[]) {
    const oldBatches = await this.storage.get(this.storageKey);
    if (oldBatches != null) {
      oldBatches.forEach(oldBatch => {
        const newBatch = updatedBatches.find(batch => batch.id == oldBatch.id);
        if (newBatch == null) {
          oldBatch.inspections.forEach(inspection => this.deleteInspectionFromCache(inspection.id));
        } else {
          oldBatch.inspections.forEach(inspection => {
            if (newBatch.inspections.every(newInspection => newInspection.id != inspection.id)) {
              this.deleteInspectionFromCache(inspection.id);
            }
          })
        }
      });
    }
  }

  public downloadInspection(idInspection: string): Promise<boolean> {
    return new Promise(async(resolve) => {
      const visitCreated = await this.createVisit(idInspection);
      if (visitCreated) {
        this.getInspection(idInspection)
          .subscribe(
            async (data: InspectionWithBuildingsList) => {
              await this.saveInspection(data);
              const idBuildings: string[] = data.buildings.map(building => building.idBuilding);
              const downloads = this.downloadBuildingsData(idBuildings);
              downloads.push(this.downloadInspectionSurvey(idInspection, 'question'));
              downloads.push(this.downloadInspectionSurvey(idInspection, 'answer'));
              resolve(await Promise.all(downloads)
                .then(responses => responses.every(r => r)));
            },
            async () => resolve(false)
          );
      } else {
        resolve(false);
      }
    });
  }

  public async deleteInspectionFromCache(idInspection: string) {
    const inspection: InspectionWithBuildingsList = await this.storage.get('inspection_buildings_' + idInspection);
    if (inspection != null) {
      inspection.buildings.forEach(async (building) => {
        await this.deleteBuildingData(building);
      });
      await this.storage.remove('inspection_buildings_' + idInspection);
      await this.storage.remove('inspection_survey_answers_' + idInspection);
      await this.storage.remove('inspection_survey_questions_' + idInspection);
    }
  }

  private async deleteBuildingData(building) {
    await this.storage.remove('building_detail_' + building.idBuilding);
    await this.storage.remove('building_contacts_' + building.idBuilding);
    await this.storage.remove('building_hazardous_materials_' + building.idBuilding);
    await this.storage.remove('building_plan_pictures_' + building.idBuilding);
    await this.storage.remove('building_pnaps_' + building.idBuilding);
    await this.storage.remove('building_sprinklers_' + building.idBuilding);
    await this.storage.remove('building_alarm_panels_' + building.idBuilding);
    await this.storage.remove('building_courses_' + building.idBuilding);
    await this.deleteAnomaliesData(building);
    await this.deleteParticularRisksData(building);
    await this.storage.remove('fire_hydrant_for_building_' + building.idBuilding);
    await this.storage.remove('building_fire_hydrants_' + building.idBuilding);
  }

  private async deleteAnomaliesData(building) {
    const anomalies = await this.storage.get('building_anomalies_' + building.idBuilding);
    if (anomalies != null) {
      anomalies.forEach(async (anomaly) => await this.storage.remove('building_anomaly_pictures_' + anomaly.id));
    }
    await this.storage.remove('building_anomalies_' + building.idBuilding);
  }

  private async deleteParticularRisksData(building) {
    await this.deleteRiskPictures(building.idBuilding, 'floor');
    await this.deleteRiskPictures(building.idBuilding, 'foundation');
    await this.deleteRiskPictures(building.idBuilding, 'wall');
    await this.deleteRiskPictures(building.idBuilding, 'roof');
    await this.storage.remove('building_particular_risk_floor_' + building.idBuilding);
    await this.storage.remove('building_particular_risk_foundation_' + building.idBuilding);
    await this.storage.remove('building_particular_risk_wall_' + building.idBuilding);
    await this.storage.remove('building_particular_risk_roof_' + building.idBuilding);
  }

  private async deleteRiskPictures(idBuilding: string, riskType: string) {
    const risk = await this.storage.get('building_particular_risk_'+ riskType + '_' + idBuilding);
    if (risk != null) {
      await this.storage.remove('building_particular_risk_pictures_' + risk.id);
    }
  }

  public downloadInspectionSurvey(idInspection: string, entityName: string): Promise<boolean>{
    return new Promise((resolve) => {
      this.service.get('InspectionSurveyAnswer/Inspection/' + idInspection + '/' + entityName)
        .subscribe(
          async (data: InspectionSurveyAnswer[]) => {
            await this.storage.set('inspection_survey_'+ entityName + 's_' + idInspection, data);
            resolve(true);
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
      promises.push(this.downloadData<InspectionBuildingFireHydrantForList[]>(idBuilding, 'inspection/building/' + idBuilding + '/fireHydrant', 'building_fire_hydrants_'));
      promises.push(this.downloadData<InspectionBuildingParticularRisk>(idBuilding, 'inspection/building/' + idBuilding + '/ParticularRisk/floor', 'building_particular_risk_floor_'));
      promises.push(this.downloadData<InspectionBuildingParticularRisk>(idBuilding, 'inspection/building/' + idBuilding + '/ParticularRisk/foundation', 'building_particular_risk_foundation_'));
      promises.push(this.downloadData<InspectionBuildingParticularRisk>(idBuilding, 'inspection/building/' + idBuilding + '/ParticularRisk/wall', 'building_particular_risk_wall_'));
      promises.push(this.downloadData<InspectionBuildingParticularRisk>(idBuilding, 'inspection/building/' + idBuilding + '/ParticularRisk/roof', 'building_particular_risk_roof_'));
      promises.push(this.downloadData<CityFireHydrantForList>(idBuilding, 'fireHydrant/forBuilding/' + idBuilding + '/withinDistance/200', 'fire_hydrant_for_building_'));
      promises.push(this.downloadData<InspectionBuildingFireHydrantForList>(idBuilding, 'inspection/building/' + idBuilding + '/fireHydrant', 'building_fire_hydrants_'));
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

  private createVisit(idInspection: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.service.post('Inspection/CreateVisit', JSON.stringify(idInspection))
        .subscribe(
          () => {
            resolve(true);
          },
          () => resolve(false)
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
