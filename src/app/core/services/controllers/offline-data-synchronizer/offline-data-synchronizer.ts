import { Injectable } from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { RiskLevelDataSynchronizerProvider } from '../../http/risk-level-data-synchronizer/risk-level-data-synchronizer';
import { UnitOfMeasureDataSynchronizerProvider } from '../../http/unit-of-measure-data-synchronizer/unit-of-measure-data-synchronizer';
import { ConstructionTypeDataSynchronizerProvider
  } from '../../http/construction-type-data-synchronizer/construction-type-data-synchronizer';
import { AlarmTypeDataSynchronizerProvider } from '../../http/alarm-type-data-synchronizer/alarm-type-data-synchronizer';
import { SprinklerTypeDataSynchronizerProvider } from '../../http/sprinkler-type-data-synchronizer/sprinkler-type-data-synchronizer';
import { FireHydrantTypeDataSynchronizerProvider
  } from '../../http/fire-hydrant-type-data-synchronizer/fire-hydrant-type-data-synchronizer';
import { RouteDirectionTypeDataSynchronizerProvider
  } from '../../http/route-direction-type-data-synchronizer/route-direction-type-data-synchronizer';
import { PersonRequiringAssistanceTypeDataSynchronizerProvider
  } from '../../http/person-requiring-assistance-type-data-synchronizer/person-requiring-assistance-type-data-synchronizer';
import { LaneDataSynchronizerProvider } from '../../http/lane-data-synchronizer/lane-data-synchronizer';
import { HazardousMaterialDataSynchronizerProvider
  } from '../../http/hazardous-material-data-synchronizer/hazardous-material-data-synchronizer';
import { CityDataSynchronizerProvider } from '../../http/city-data-synchronizer/city-data-synchronizer';
import { InspectionDataSynchronizerProvider } from '../../http/inspection-data-synchronizer/inspection-data-synchronizer';
import { FirestationDataSynchronizerProvider } from '../../http/firestation-data-synchronizer/firestation-data-synchronizer';
import { AnomalyThemeDataSynchronizerProvider } from '../../http/anomaly-theme-data-synchronizer/anomaly-theme-data-synchronizer';

@Injectable({providedIn: 'root'})
export class OfflineDataSynchronizerProvider {

  private totalCount: number = 8;
  private completedCount: number = 0;

  public isSynching: boolean = false;
  public percentCompleted: number = 0;

  constructor(
    private storage: OfflineStorage,
    private riskLevelRepo: RiskLevelDataSynchronizerProvider,
    private measureRepo: UnitOfMeasureDataSynchronizerProvider,
    private constructionRepo: ConstructionTypeDataSynchronizerProvider,
    private alarmTypeRepo: AlarmTypeDataSynchronizerProvider,
    private sprinklerTypeRepo: SprinklerTypeDataSynchronizerProvider,
    private fireHydrantTypeRepo: FireHydrantTypeDataSynchronizerProvider,
    private routeDirectionRepo: RouteDirectionTypeDataSynchronizerProvider,
    private pnapTypeRepo: PersonRequiringAssistanceTypeDataSynchronizerProvider,
    private laneRepo: LaneDataSynchronizerProvider,
    private matRepo: HazardousMaterialDataSynchronizerProvider,
    private cityRepo: CityDataSynchronizerProvider,
    private inspectionRepo: InspectionDataSynchronizerProvider,
    private firestationRepo: FirestationDataSynchronizerProvider,
    private themeRepo: AnomalyThemeDataSynchronizerProvider
  ) {
  }

  public synchronizeBaseEntities(): Promise<boolean> {
    this.startNewSynchronization();
    const tasks = [
      this.themeRepo.synchronizeAllWhenNecessary().then(wasSuccessful => this.setTaskAsCompleted(wasSuccessful)),
      this.matRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.riskLevelRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.measureRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.constructionRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.alarmTypeRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.sprinklerTypeRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.fireHydrantTypeRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.routeDirectionRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.pnapTypeRepo.synchronizeAllWhenNecessary().then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)),
      this.inspectionRepo.synchronizeAll().then(wasSuccessful => this.setTaskAsCompleted(wasSuccessful))
    ];

    return this.runSynchronization(tasks);
  }

  public synchronizingCities(cityIds: string[]): Promise<boolean> {
    this.startNewSynchronization();

    let promises = this.laneRepo
      .synchAll(cityIds)
      .map(m => m.then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful)));

    promises = promises.concat( this.cityRepo
      .synchAll(cityIds)
      .map(m => m.then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful))));

    promises = promises.concat( this.firestationRepo
      .synchAll(cityIds)
      .map(m => m.then((wasSuccessful) => this.setTaskAsCompleted(wasSuccessful))));

    return this.runSynchronization(promises);
  }

  public downloadInspections(inspectionIds: string[]): Promise<boolean> {
    this.startNewSynchronization();
    const tasks = inspectionIds
      .map(inspectionId => this.inspectionRepo.downloadInspection(inspectionId).then(wasSuccess => this.setTaskAsCompleted(wasSuccess)));

    return this.runSynchronization(tasks);
  }

  private startNewSynchronization() {
    this.isSynching = true;
    this.completedCount = 0;
    this.percentCompleted = 0;
  }

  private runSynchronization(tasks: Promise<boolean>[]): Promise<boolean> {
    this.totalCount = tasks.length;
    return Promise.all(tasks)
      .then(responses => {
        this.isSynching = false;
        return responses.every(r => r);
      });
  }

  private setTaskAsCompleted(wasSuccessful: boolean): boolean {
    this.completedCount++;
    this.percentCompleted = this.completedCount * 100 / this.totalCount;
    return wasSuccessful;
  }
}
