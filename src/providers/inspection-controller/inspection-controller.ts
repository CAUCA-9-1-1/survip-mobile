import {EventEmitter, Injectable} from '@angular/core';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {LoadingController} from 'ionic-angular';
import {InspectionBuildingForList} from '../../models/inspection-building-for-list';
import {InspectionDetailRepositoryProvider} from '../repositories/inspection-detail-repository-provider.service';
import {InspectionBuildingsRepositoryProvider} from '../repositories/inspection-buildings-repository-provider.service';
import {BuildingFireHydrantRepositoryProvider} from "../repositories/building-fire-hydrant-repository";
import {map} from "rxjs/operators";
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
    private configController: InspectionConfigurationProvider,
    private repoInspection: InspectionRepositoryProvider,
    private repoDetail: InspectionDetailRepositoryProvider,
    private repoBuildings: InspectionBuildingsRepositoryProvider,
    private loadingCtrl: LoadingController,
    private laneRepo: LaneRepositoryProvider,
    private dataRepoInspection: InspectionDataSynchronizerProvider,
    private buildingFireHydrantRepo: BuildingFireHydrantRepositoryProvider) {
  }

  public async setIdInspection(idInspection: string): Promise<boolean> {
    if (this.idInspection != idInspection) {
      console.log('change inspection');
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

  public loadBuildingList() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.repoBuildings.get(this.idInspection);
    result.subscribe(data => {
        this.buildings = data as InspectionBuildingForList[];
        loading.dismiss();
      },
      () => loading.dismiss());
  }

  private createLoadingControl() {
    return this.loadingCtrl.create({content: this.labels['loading']});
  }

  public savePlanIdPicture(idPicture: string) {
    /*        this.inspectionDetail.idPictureSitePlan = idPicture;
            this.repoDetail.savePicture(this.inspectionDetail.idDetail, this.inspectionDetail.idPictureSitePlan)
                .subscribe(ok => {
                    console.log("Picture saved", ok);
                });*/
  }

  public getMainBuilding(): InspectionBuildingForList{
      return this.inspection.buildings.filter(building => building.isMainBuilding)[0];
  }

  public saveBuildings() {
      this.repoInspection.save(this.inspection);
  }

  public deleteBuildingFireHydrant(idBuildingFireHydrant: string) {
    return this.buildingFireHydrantRepo.deleteBuildingFireHydrant(idBuildingFireHydrant)
      .pipe(map(response => response));
  }
}
