import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {LoadingController} from 'ionic-angular';
import {PictureData} from '../../models/picture-data';
import {PictureRepositoryProvider} from '../repositories/picture-repository';
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
export class InspectionControllerProvider {
    idInspection: string;
    mainBuildingName: string;

    courses: InspectionBuildingCourseForList[];

    buildings: InspectionBuildingForList[];
    firestations: FirestationForlist[];

    inspectionDetail: InspectionDetail;
    picture: PictureData;

    planLoaded: EventEmitter<any> = new EventEmitter<any>();
    pictureLoaded: EventEmitter<any> = new EventEmitter<any>();

    labels = {};

    constructor(
        private repoDetail: InspectionDetailRepositoryProvider,
        private repoBuildings: InspectionBuildingsRepositoryProvider,
        private loadingCtrl: LoadingController,
        private laneRepo: LaneRepositoryProvider,
        private pictureRepo: PictureRepositoryProvider,
        private buildingfirehydrantRepo: BuildingFireHydrantRepositoryProvider,
        private translateService: TranslateService,
    ) {
    }

    loadTranslation() {
        this.translateService.get([
            'loading'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    setIdInterventionForm(idInterventionForm: string) {
        this.idInspection = idInterventionForm;
    }

    loadInterventionForm() {
        const loading = this.createLoadingControl();
        loading.present();
        const result = this.repoDetail.get(this.idInspection);
        result.subscribe(data => {
            const plan: InspectionDetail = data as InspectionDetail;
            this.laneRepo.currentIdCity = plan.idCity;
            this.inspectionDetail = plan;
            this.planLoaded.emit(null);
            loading.dismiss();
        });
    }

    loadBuildingList() {
        const loading = this.createLoadingControl();
        loading.present();
        const result = this.repoBuildings.get(this.idInspection);
        result.subscribe(data => {
            this.buildings = data as InspectionBuildingForList[];
            loading.dismiss();
        });
    }

    private createLoadingControl() {
        return this.loadingCtrl.create({content: this.labels['loading']});
    }

    loadInterventionFormPicture() {
        const loading = this.createLoadingControl();
        loading.present();
        const result = this.pictureRepo.getPicture(this.inspectionDetail.idPictureSitePlan);
        result.subscribe(data => {
            this.picture = data as PictureData;
            this.pictureLoaded.emit(null);
            loading.dismiss();
        });
    }

    async savePicture() {
        let idPicture = await this.pictureRepo.savePicture(this.picture);
        if (this.inspectionDetail.idPictureSitePlan != idPicture)
            this.savePlanIdPicture(idPicture as string);
    }

    private savePlanIdPicture(idPicture: string) {
        this.inspectionDetail.idPictureSitePlan = idPicture;
        this.repoDetail.savePicture(this.inspectionDetail.idDetail, this.inspectionDetail.idPictureSitePlan)
            .subscribe(ok => {
                console.log("Picture saved", ok);
            });
    }

    savePlanTransversal() {
        this.repoDetail.savePlanLane(this.inspectionDetail.id, this.inspectionDetail.idLaneTransversal)
            .subscribe(ok => {
                console.log("Plan saved", ok);
            });
    }

    deleteBuildingFireHydrant(idBuildingFireHydrant: string) {
        return this.buildingfirehydrantRepo.deleteBuildingFireHydrant(idBuildingFireHydrant)
            .pipe(map(response => response));
    }
}
