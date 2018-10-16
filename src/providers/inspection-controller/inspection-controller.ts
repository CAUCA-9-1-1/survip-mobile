import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {LoadingController} from 'ionic-angular';
import {FirestationForlist} from '../../models/firestation';
import {InspectionBuildingCourseForList} from '../../models/inspection-building-course-for-list';
import {InspectionBuildingForList} from '../../models/inspection-building-for-list';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionDetailRepositoryProvider} from '../repositories/inspection-detail-repository-provider.service';
import {InspectionBuildingsRepositoryProvider} from '../repositories/inspection-buildings-repository-provider.service';
import {BuildingFireHydrantRepositoryProvider} from "../repositories/building-fire-hydrant-repository";
import {map} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class InspectionControllerProvider{
    public idInspection: string;
    public mainBuildingName: string;

    public courses: InspectionBuildingCourseForList[];

    public buildings: InspectionBuildingForList[];
    public firestations: FirestationForlist[];

    public inspectionDetail: InspectionDetail;

    public planLoaded: EventEmitter<any> = new EventEmitter<any>();
    public pictureLoaded: EventEmitter<any> = new EventEmitter<any>();

    public labels = {};

    constructor(
        private repoDetail: InspectionDetailRepositoryProvider,
        private repoBuildings: InspectionBuildingsRepositoryProvider,
        private loadingCtrl: LoadingController,
        private laneRepo: LaneRepositoryProvider,
        private buildingfirehydrantRepo: BuildingFireHydrantRepositoryProvider,
        private translateService: TranslateService,
    ) {
    }

    public  loadTranslation() {
        this.translateService.get([
            'loading'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public setIdInterventionForm(idInterventionForm: string) {
        this.idInspection = idInterventionForm;
    }

    public loadInterventionForm() {
        const loading = this.createLoadingControl();
        loading.present();
        const result = this.repoDetail.get(this.idInspection);
        result.subscribe(data => {
            const plan: InspectionDetail = data as InspectionDetail;
            this.laneRepo.currentIdCity = plan.idCity;
            this.inspectionDetail = plan;
            this.planLoaded.emit(null);
            loading.dismiss();
        },
          error => {
            this.planLoaded.emit('loadingError');
            loading.dismiss();
          }
        );
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
        return this.buildingfirehydrantRepo.deleteBuildingFireHydrant(idBuildingFireHydrant)
            .pipe(map(response => response));
    }
}
