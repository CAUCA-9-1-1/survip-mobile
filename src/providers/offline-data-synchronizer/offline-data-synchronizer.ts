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
    return Promise.all([
      this.riskLevelRepo.synchAll(),
      this.measureRepo.synchAll(),
      this.constructionRepo.synchAll(),
      this.alarmTypeRepo.synchAll(),
      this.sprinklerTypeRepo.synchAll(),
      this.fireHydrantTypeRepo.synchAll(),
      this.routeDirectionRepo.synchAll(),
      this.pnapTypeRepo.synchAll()
    ])
      .then(responses => responses.every(r => r));
  }

  public get(key: string) : Promise<any>{
    return this.storage.get(key);
  }
}
