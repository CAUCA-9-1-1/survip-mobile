import {EventEmitter, Injectable} from '@angular/core';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {LoadingController} from 'ionic-angular';
import {InspectionBuildingForList} from '../../models/inspection-building-for-list';
import {Inspection} from "../../interfaces/inspection.interface";
import {InspectionRepositoryProvider} from "../repositories/inspection-repository-provider.service";
import {InspectionWithBuildingsList} from "../../models/inspection-with-buildings-list";
import {InspectionConfigurationProvider} from "../inspection-configuration/inspection-configuration";
import {InspectionDataSynchronizerProvider} from "../inspection-data-synchronizer/inspection-data-synchronizer";

@Injectable()
export class InspectionControllerProvider {

  public currentInspection: Inspection;
  public idInspection: string;
  public buildings: InspectionBuildingForList[];
  public inspection: InspectionWithBuildingsList;
  public planLoaded: EventEmitter<any> = new EventEmitter<any>();
  public labels = {};

  constructor(
    private repoSynchro: InspectionDataSynchronizerProvider,
    private configController: InspectionConfigurationProvider,
    private repoInspection: InspectionRepositoryProvider,
    private loadingCtrl: LoadingController,
    private laneRepo: LaneRepositoryProvider,
    private dataRepoInspection: InspectionDataSynchronizerProvider) {
  }

  public async setIdInspection(idInspection: string): Promise<boolean> {
    if (this.idInspection != idInspection) {
      const successfullyLoaded: boolean = await this.loadInspection(idInspection);
      if (successfullyLoaded){
        this.idInspection = idInspection;
      }
      return successfullyLoaded;
    }
    return true;
  }

  private loadInspection(idInspection: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      this.currentInspection = null;
      const loading = this.createLoadingControl();
      await loading.present();
      this.currentInspection = await this.repoInspection.getResumedInspection(idInspection);
      this.inspection = await this.repoInspection.getInspection(idInspection);

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
        )
      } else {
        await this.loadLanesAndSetConfiguration(loading);
        await loading.dismiss();
        resolve(true);
      }
    });
  }

  private async loadLanesAndSetConfiguration(loading) {
    await this.configController.setConfiguration(this.inspection.configuration);
    await this.laneRepo.setCurrentIdCity(this.currentInspection.idCity);
    await loading.dismiss();
  }

  private createLoadingControl() {
    return this.loadingCtrl.create({content: this.labels['loading']});
  }

  public getMainBuilding(): InspectionBuildingForList{
      return this.inspection.buildings.filter(building => building.isMainBuilding)[0];
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
