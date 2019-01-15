import {EventEmitter, Injectable} from '@angular/core';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {LoadingController} from 'ionic-angular';
import {InspectionBuildingForList} from '../../models/inspection-building-for-list';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionDetailRepositoryProvider} from '../repositories/inspection-detail-repository-provider.service';
import {InspectionBuildingsRepositoryProvider} from '../repositories/inspection-buildings-repository-provider.service';
import {BuildingFireHydrantRepositoryProvider} from "../repositories/building-fire-hydrant-repository";
import {map} from "rxjs/operators";
import {Inspection} from "../../interfaces/inspection.interface";
import {InspectionRepositoryProvider} from "../repositories/inspection-repository-provider.service";

@Injectable()
export class InspectionControllerProvider{

    public currentInspection: Inspection;
    public idInspection: string;
    public buildings: InspectionBuildingForList[];
    public inspectionDetail: InspectionDetail;
    public planLoaded: EventEmitter<any> = new EventEmitter<any>();
    public labels = {};

    constructor(
        private repoInspection: InspectionRepositoryProvider,
        private repoDetail: InspectionDetailRepositoryProvider,
        private repoBuildings: InspectionBuildingsRepositoryProvider,
        private loadingCtrl: LoadingController,
        private laneRepo: LaneRepositoryProvider,
        private buildingFireHydrantRepo: BuildingFireHydrantRepositoryProvider) {
    }

    public async setIdInspection(idInspection: string) {
      if (this.idInspection != idInspection) {
        console.log('change inspection');
        this.idInspection = idInspection;
        await this.loadInspection();
      }
    }

    private async loadInspection() {
        this.currentInspection = null;
        const loading = this.createLoadingControl();
        await loading.present();
        this.currentInspection = await this.repoInspection.get(this.idInspection);
        console.log('inspection', this.currentInspection);
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
        this.inspectionDetail.idPictureSitePlan = idPicture;
        this.repoDetail.savePicture(this.inspectionDetail.idDetail, this.inspectionDetail.idPictureSitePlan)
            .subscribe(ok => {
                console.log("Picture saved", ok);
            });
    }

    public savePlanTransversal() {
        this.repoDetail.savePlanLane(this.inspectionDetail.id, this.inspectionDetail.idLaneTransversal)
            .subscribe(ok => {
                console.log("Plan saved", ok);
            });
    }

    public deleteBuildingFireHydrant(idBuildingFireHydrant: string) {
        return this.buildingFireHydrantRepo.deleteBuildingFireHydrant(idBuildingFireHydrant)
            .pipe(map(response => response));
    }
}
