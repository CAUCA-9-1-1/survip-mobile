import { Injectable } from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import {RiskLevelDataSynchronizerProvider} from "../risk-level-data-synchronizer/risk-level-data-synchronizer";
import {UnitOfMeasureDataSynchronizerProvider} from "../unit-of-measure-data-synchronizer/unit-of-measure-data-synchronizer";
import {ConstructionTypeDataSynchronizerProvider} from "../construction-type-data-synchronizer/construction-type-data-synchronizer";

@Injectable()
export class OfflineDataSynchronizerProvider {

  constructor(
    private storage: OfflineStorage,
    private riskLevelRepo:  RiskLevelDataSynchronizerProvider,
    private measureRepo: UnitOfMeasureDataSynchronizerProvider,
    private constructionRepo: ConstructionTypeDataSynchronizerProvider
  ) {
  }

  public synchronizeBaseEntities() : Promise<boolean> {
    return Promise.all([
      this.riskLevelRepo.synchAll(),
      this.measureRepo.synchAll(),
      this.constructionRepo.synchAll()
    ])
      .then(responses => responses.every(r => r));
  }

  public get(key: string) : Promise<any>{
    return this.storage.get(key);
  }
}
