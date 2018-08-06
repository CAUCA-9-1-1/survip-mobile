import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionFormFireHydrantRepositoryProvider} from '../../providers/repositories/intervention-form-fire-hydrant-repository';
import {InspectionBuildingFireHydrantForLIst} from '../../models/intervention-form-fire-hydrant-for-list';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionBuildingFireHydrantForList} from '../../models/inspection-building-fire-hydrant-for-list';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionBuildingFireHydrantRepositoryProvider} from '../../providers/repositories/inspection-building-fire-hydrant-repository-provider';
import {CityFireHydrantPage} from "../city-fire-hydrant/city-fire-hydrant";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-intervention-water-supplies',
    templateUrl: 'intervention-water-supplies.html',
})
export class InterventionWaterSuppliesPage {

    get plan(): InspectionDetail {
        return this.controller.inspectionDetail
    }

    public fireHydrants: InspectionBuildingFireHydrantForList[] = [];
    public labels = {};

    constructor(public navCtrl: NavController,
                private authService: AuthenticationService,
                public navParams: NavParams,
                private controller: InspectionControllerProvider,
                private fireHydrantService: InspectionBuildingFireHydrantRepositoryProvider,
                private messageTools: MessageToolsProvider,
                private translateService: TranslateService,
    ) {
        this.LoadBuildingFireHydrant();
    }

    public ngOnInit() {
        this.translateService.get([
            'fireHydrantDelete', 'fireHydrantDeleteQuestion'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public async ionViewCanEnter() {
        let isLoggedIn = await this.authService.isStillLoggedIn();
        if (!isLoggedIn) {
            this.redirectToLoginPage();
        } else {
            this.LoadBuildingFireHydrant();
        }
    }

    private LoadBuildingFireHydrant() {
        this.fireHydrantService.get(this.controller.idInspection)
            .subscribe(result => this.fireHydrants = result);
    }

    private redirectToLoginPage() {
        this.navCtrl.setRoot('LoginPage');
    }


    public async onClickHydrant(idInspectionBuildingFireHydrant: string) {
        let canDelete = await this.messageTools.ShowMessageBox(this.labels['fireHydrantDelete'], this.labels['fireHydrantDeleteQuestion']);
        if (canDelete) {
            this.controller.deleteBuildingFireHydrant(idInspectionBuildingFireHydrant)
                .subscribe(result => {
                    this.LoadBuildingFireHydrant();
                }, error => {
                    this.messageTools.showToast("Erreur lors de la suppression de borne");
                });
        }
    }

    public onItemClick(idCity: string) {
        this.navCtrl.push('CityFireHydrantPage', {idCity: idCity, idBuilding: this.controller.inspectionDetail.id});
    }
}
