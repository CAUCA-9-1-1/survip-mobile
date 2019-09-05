import {EventEmitter, Injectable} from '@angular/core';
import {InspectionConfigurationProvider} from '../inspection-configuration/inspection-configuration';
import { Inspection } from 'src/app/shared/interfaces/inspection.interface';
import { InspectionBuildingForList } from 'src/app/shared/models/inspection-building-for-list';
import { InspectionWithBuildingsList } from 'src/app/shared/models/inspection-with-buildings-list';
import { InspectionDataSynchronizerProvider } from '../../http/inspection-data-synchronizer/inspection-data-synchronizer';
import { BuildingContactRepositoryProvider } from '../../repositories/building-contact-repository';
import { InspectionRepositoryProvider } from '../../repositories/inspection-repository-provider.service';
import { LoadingController } from '@ionic/angular';
import { LaneRepositoryProvider } from '../../repositories/lane-repository';
import { TranslateService } from '@ngx-translate/core';

@Injectable({providedIn: 'root'})
export class InspectionControllerProvider {

  public currentInspection: Inspection;
  public idInspection: string;
  public inspection: InspectionWithBuildingsList;
  public labels = {};
  public inspectionIsLoaded: boolean = false;
  public inspectionLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

  public currentIdBuilding: string;
  public currentBuildingName: string;

  constructor(
    private translateService: TranslateService,
    private repoSynchro: InspectionDataSynchronizerProvider,
    private configController: InspectionConfigurationProvider,
    private contactRepository: BuildingContactRepositoryProvider,
    private repoInspection: InspectionRepositoryProvider,
    private loadingCtrl: LoadingController,
    private laneRepo: LaneRepositoryProvider,
    private dataRepoInspection: InspectionDataSynchronizerProvider) {
      this.translateService.get(['childBuilding', 'parentBuilding']).subscribe(
        labels => this.labels = labels,
        error => console.log(error));
  }

  public setIdBuilding(idBuilding: string): void {
    if (this.currentIdBuilding !== idBuilding) {
      this.currentIdBuilding = idBuilding;
      const building = this.getBuilding(idBuilding);
      this.currentBuildingName = this.getBuildingName(building);
    }
  }

  public async setIdInspection(idInspection: string, forceRefresh: boolean): Promise<boolean> {
    if (this.idInspection !== idInspection || forceRefresh) {
      this.inspectionIsLoaded = false;
      const successfullyLoaded: boolean = await this.loadInspection(idInspection);
      if (successfullyLoaded) {
        this.idInspection = idInspection;
        this.inspectionIsLoaded = true;
        this.inspectionLoaded.emit(true);
      }
      return successfullyLoaded;
    }
    return true;
  }

  public setSurveyCompletionStatus(isCompleted: boolean): Promise<boolean> {
    this.inspection.isSurveyCompleted = isCompleted;
    this.inspection.surveyCompletedOn = isCompleted ? new Date() : null;
    return this.repoInspection.save(this.inspection);
  }

  private loadInspection(idInspection: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.currentInspection = null;
      const loading = await this.createLoadingControl();
      await loading.present();
      this.currentInspection = await this.repoInspection.getResumedInspection(idInspection);
      this.inspection = await this.repoInspection.getInspection(idInspection);
      this.currentInspection.hasBeenDownloaded = this.inspection != null;

      await this.refreshBuildingInformations();

      if (this.inspection == null) {
        return this.dataRepoInspection.getInspection(idInspection).subscribe(
          async (inspection) => {
            this.inspection = inspection;
            await this.loadLanesAndSetConfiguration(loading);
            await loading.dismiss();
            resolve(true);
          },
          async () => {
            await loading.dismiss();
            resolve(false);
          }
        );
      } else {
        await this.loadLanesAndSetConfiguration(loading);
        await loading.dismiss();
        resolve(true);
      }
    });
  }

  public async refreshBuildingInformations() {
    if (this.currentInspection.hasBeenDownloaded) {
      this.currentInspection.ownerName = await this.contactRepository.getOwnerName(this.getMainBuilding().idBuilding);
      this.currentInspection.aliasName = this.getMainBuilding().aliasName;
      this.currentInspection.corporateName = this.getMainBuilding().corporateName;
    }
  }

  private async loadLanesAndSetConfiguration(loading) {
    await this.configController.setConfiguration(this.inspection.configuration);
    await this.laneRepo.setCurrentIdCity(this.currentInspection.idCity);
    await loading.dismiss();
  }

  private async createLoadingControl() {
    return await this.loadingCtrl.create({message: this.labels['loading']});
  }

  public getMainBuilding(): InspectionBuildingForList {
    if (this.inspection != null) {
      return this.inspection.buildings.filter(building => building.isMainBuilding)[0];
    } else {
      return null;
    }
  }

  public getBuilding(idBuilding: string): InspectionBuildingForList {
    return this.inspection.buildings.find(building => building.idBuilding === idBuilding);
  }

  public getBuildingName(building: InspectionBuildingForList) {
    if (building.aliasName) {
      return building.aliasName;
    } else if (building.corporateName) {
      return building.corporateName;
    } else if (building.isMainBuilding) {
      return this.labels['parentBuilding'];
    } else {
      return this.labels['childBuilding'];
    }
  }

  public saveBuildings() {
      this.repoInspection.save(this.inspection);
  }

  public downloadCurrentInspection(): Promise<boolean> {
    return this.repoSynchro.downloadInspection(this.inspection.id)
      .then(
        wasSuccessful => wasSuccessful,
        () => false);
  }

  public async updateCurrentInspection(inspection: InspectionWithBuildingsList) {
    this.inspection = inspection;
    this.currentInspection.hasBeenDownloaded = true;
    this.currentInspection.status = inspection.status;
    await this.repoInspection.saveCurrentInspection(inspection);
  }
}
