import { Injectable } from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import {RiskLevelDataSynchronizerProvider} from "../risk-level-data-synchronizer/risk-level-data-synchronizer";
import {UnitOfMeasureDataSynchronizerProvider} from "../unit-of-measure-data-synchronizer/unit-of-measure-data-synchronizer";

@Injectable()
export class OfflineDataSynchronizerProvider {

  constructor(
    private storage: OfflineStorage,
    private riskLevelRepo:  RiskLevelDataSynchronizerProvider,
    private measureRepo: UnitOfMeasureDataSynchronizerProvider,
  ) {
  }

  public synchronizeBaseEntities() : Promise<boolean> {
    return Promise.all([
      this.riskLevelRepo.synchAll(),
      this.measureRepo.synchAll()
    ])
      .then(responses => responses.every(r => r));
  }

  public get(key: string) : Promise<any>{
    return this.storage.get(key);
  }
}
