import { Injectable } from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import {RiskLevelDataSynchronizerProvider} from "../risk-level-data-synchronizer/risk-level-data-synchronizer";
import {UnitOfMeasureDataSynchronizerProvider} from "../unit-of-measure-data-synchronizer/unit-of-measure-data-synchronizer";
import {ConstructionTypeDataSynchronizerProvider} from "../construction-type-data-synchronizer/construction-type-data-synchronizer";
import {AlarmTypeDataSynchronizerProvider} from "../alarm-type-data-synchronizer/alarm-type-data-synchronizer";
import {SprinklerTypeDataSynchronizerProvider} from "../sprinkler-type-data-synchronizer/sprinkler-type-data-synchronizer";
import {FireHydrantTypeDataSynchronizerProvider} from "../fire-hydrant-type-data-synchronizer/fire-hydrant-type-data-synchronizer";
import {RouteDirectionTypeDataSynchronizerProvider} from "../route-direction-type-data-synchronizer/route-direction-type-data-synchronizer";
import {PersonRequiringAssistanceTypeDataSynchronizerProvider} from "../person-requiring-assistance-type-data-synchronizer/person-requiring-assistance-type-data-synchronizer";

@Injectable()
export class OfflineDataSynchronizerProvider {

  private totalCount: number = 8;
  private completedCount: number = 0;

  public isSynching: boolean = false;
  public percentCompleted: number = 0;

  constructor(
    private storage: OfflineStorage,
    private riskLevelRepo:  RiskLevelDataSynchronizerProvider,
    private measureRepo: UnitOfMeasureDataSynchronizerProvider,
    private constructionRepo: ConstructionTypeDataSynchronizerProvider,
    private alarmTypeRepo : AlarmTypeDataSynchronizerProvider,
    private sprinklerTypeRepo: SprinklerTypeDataSynchronizerProvider,
    private fireHydrantTypeRepo : FireHydrantTypeDataSynchronizerProvider,
    private routeDirectionRepo: RouteDirectionTypeDataSynchronizerProvider,
    private pnapTypeRepo: PersonRequiringAssistanceTypeDataSynchronizerProvider
  ) {
  }

  public synchronizeBaseEntities() : Promise<boolean> {
    this.isSynching = true;
    this.completedCount = 0;
    this.percentCompleted = 0;
    return Promise.all([
      this.riskLevelRepo.synchAll().then((wasSuccessful)=> this.setTaskAsCompleted(wasSuccessful)),
      this.measureRepo.synchAll().then((wasSuccessful)=> this.setTaskAsCompleted(wasSuccessful)),
      this.constructionRepo.synchAll().then((wasSuccessful)=> this.setTaskAsCompleted(wasSuccessful)),
      this.alarmTypeRepo.synchAll().then((wasSuccessful)=> this.setTaskAsCompleted(wasSuccessful)),
      this.sprinklerTypeRepo.synchAll().then((wasSuccessful)=> this.setTaskAsCompleted(wasSuccessful)),
      this.fireHydrantTypeRepo.synchAll().then((wasSuccessful)=> this.setTaskAsCompleted(wasSuccessful)),
      this.routeDirectionRepo.synchAll().then((wasSuccessful)=> this.setTaskAsCompleted(wasSuccessful)),
      this.pnapTypeRepo.synchAll().then((wasSuccessful)=> this.setTaskAsCompleted(wasSuccessful))
    ])
      .then(responses => {
        console.log('sync all finished.');
        this.isSynching = false;
        return responses.every(r => r);
      });
  }

  private setTaskAsCompleted(wasSuccessful: boolean): boolean{
    this.completedCount++;
    this.percentCompleted = this.completedCount * 100 / this.totalCount;
    console.log('completed count: ' + this.completedCount + '. ' + this.percentCompleted + '%');
    return wasSuccessful;
  }

  public get(key: string) : Promise<any>{
    return this.storage.get(key);
  }
}
