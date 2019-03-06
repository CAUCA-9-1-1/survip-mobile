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
      promises.push(this.saveInspectionSurveyAnswers(idInspection));
      inspection.buildings.forEach(building => {
        promises.push(this.saveSingleEntity(building, ''));
        promises.push(this.saveBuildingHydrants(building.idBuilding));
        promises.push(this.savePictures(building.idBuilding, 'building_plan_picture_', building.idBuilding + '/detail/picture'));
        promises.push(this.saveEntity(building.idBuilding, 'building_detail_', 'detail'));
        promises.push(this.saveEntities(building.idBuilding, 'building_contacts_', 'contact'));
        promises.push(this.saveEntities(building.idBuilding, 'building_courses_', 'listCourse'));
        promises.push(this.saveEntities(building.idBuilding, 'building_hazardous_materials_', 'hazardousmaterial'));
        promises.push(this.saveEntities(building.idBuilding, 'building_pnaps_', 'pnaps'));
        promises.push(this.saveEntities(building.idBuilding, 'building_sprinklers_', 'sprinkler'));
        promises.push(this.saveEntities(building.idBuilding, 'building_alarm_panels_', 'alarmpanel'));
        promises.push(this.saveEntities(building.idBuilding, 'building_anomalies_', 'anomaly', 'building_anomaly_pictures_', 'anomaly/pictures'));
        promises.push(this.saveParticularRisk(building.idBuilding, 'wall'));
        promises.push(this.saveParticularRisk(building.idBuilding, 'foundation'));
        promises.push(this.saveParticularRisk(building.idBuilding, 'floor'));
        promises.push(this.saveParticularRisk(building.idBuilding, 'roof'));
      });
      const success = await Promise.all(promises)
        .then(responses => responses.every(r => r));

      if (success) {
        return this.storage.set('inspection_buildings_' + idInspection, inspection);
      } else {
        return false;
      }

    } else {
      return false;
    }
  }

  private async saveBuildingHydrants(idBuilding: string): Promise<boolean>{
    const entities = await this.storage.get('building_fire_hydrants_' + idBuilding);
    if (entities != null && entities.length > 0) {
      const ids = entities.map(hydrant => hydrant.idFireHydrant);
      if (await this.sendToApi(ids, idBuilding + '/firehydrants')) {
        entities.forEach(hydrant => hydrant.hasBeenModified = false);
        return await this.storage.set('building_fire_hydrants_' + idBuilding, entities);
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  private async saveInspectionSurveyAnswers(idInspection: string): Promise<boolean> {
    const entities = await this.storage.get('inspection_survey_answers_' + idInspection);
    const answersToSave = [];
    if (entities != null && entities.length > 0) {
      entities.forEach(answer => {

        if (answer.questionType == 4) {

          const childAnswers = answer.childSurveyAnswerList.filter(a => a.answer != null);
          if (childAnswers.length > 0) {
            answersToSave.push(answer);
            childAnswers.forEach(childAnswer => {
              if (childAnswer.answer != null) {
                answersToSave.push(childAnswer);
              }
            })
          }
        } else if (answer.answer != null) {
          answersToSave.push(answer);
        }
      });

      console.log('answers to save', answersToSave);
      return await this.sendAnswersToApi(idInspection, answersToSave);
    } else {
      return true;
    }
  }

  private sendAnswersToApi(idInspection: string, answers): Promise<boolean>{
    return  new Promise((resolve) => {
      this.httpService.post('Inspection/' + idInspection + '/Answers', JSON.stringify(answers))
        .subscribe(
          () => resolve(true),
          () => resolve(false)
        );
    });
  }

  private async saveEntities(idBuilding: string, key: string, url: string, pictureKey?: string, pictureUrl?: string): Promise<boolean> {
    const entities = await this.storage.get(key + idBuilding);
    console.log('about to save', key, url, entities);
    if (entities != null) {
      const promises: Promise<boolean>[] = [];
      entities.forEach(entity => promises.push(this.saveSingleEntity(entity, url, pictureKey, pictureUrl)));
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

  private async savePictures(idParent: string, key: string, url: string): Promise<boolean> {
    console.log('saved pictures', key, url);
    const entities = await this.storage.get(key + idParent);
    console.log('pictures', entities.length, entities);
    if (entities != null && entities.length > 0) {
      const modifiedEntities = entities.filter(entity => entity.hasBeenModified);
      console.log('modified pictures', modifiedEntities.length, modifiedEntities);
      if (modifiedEntities.length > 0) {
        if (await this.sendToApi(modifiedEntities, url)) {
          modifiedEntities.forEach(entity => entity.hasBeenModified = false);
          await this.storage.set(key + idParent, entities);
          console.log('saved pictures', key, url);
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
    return true;
  }

  private async saveSingleEntity(entity, url: string, pictureKey?: string, pictureUrl?: string): Promise<boolean> {
    console.log('has been modified', url, entity);
    if (entity.hasBeenModified) {
      const hasBeenSaved = await this.sendToApi(entity, url);
      if (hasBeenSaved) {
        entity.hasBeenModified = false;
        if (pictureKey != null) {
          return this.savePictures(entity.id, pictureKey, pictureUrl);
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      if (pictureKey != null) {
        return this.savePictures(entity.id, pictureKey, pictureUrl);
      } else {
        return true;
      }
    }
  }

  private async saveParticularRisk(idBuilding: string, riskType: string) {
    const url = 'particularrisk/' + riskType;
    const key = 'building_particular_risk_'+ riskType + '_';
    return this.saveEntity(idBuilding, key, url, 'building_particular_risk_pictures_', 'particularrisk/pictures');
  }

  private async saveEntity(idBuilding: string, key: string, url: string, pictureKey?: string, pictureUrl?: string): Promise<boolean> {
    const entity = await this.storage.get(key + idBuilding);
    if (entity.hasBeenModified) {
      const hasBeenSaved = await this.sendToApi(entity, url);
      if (hasBeenSaved) {
        entity.hasBeenModified = false;
        await this.storage.set(key + idBuilding, entity);
        console.log('saved entity', key, url);

        if (pictureKey != null) {
          return this.savePictures(entity.id, pictureKey, pictureUrl);
        } else {
          return true;
        }
      } else {
        return false;
      }
    } else {
      if (pictureKey != null) {
        return this.savePictures(entity.id, pictureKey, pictureUrl);
      } else {
        return true;
      }
    }
  }

  private sendToApi(entity, url: string): Promise<boolean> {
    let completeUrl = 'inspection/building/';

    if (url != null && url != '') {
      completeUrl += url + '/';
    }
    console.log('final url', completeUrl, url);

    return new Promise((resolve) => {
      this.httpService.post(completeUrl, JSON.stringify(entity))
        .subscribe(
          () => resolve(true),
          () => resolve(false)
        );
    });
  }
}
