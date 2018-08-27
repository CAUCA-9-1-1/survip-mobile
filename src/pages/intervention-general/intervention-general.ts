import {Component, OnDestroy} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RiskLevel} from '../../models/risk-level';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {ISubscription} from 'rxjs/Subscription';
import {InterventionForm} from '../../models/intervention-form';
import {UtilisationCodeRepositoryProvider} from '../../providers/repositories/utilisation-code-repository';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionDetailRepositoryProvider} from "../../providers/repositories/inspection-detail-repository-provider.service";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
import {MapLocalizationRepositoryService} from "../../providers/repositories/map-localisation-repository-service";
import {InspectionConfigurationProvider} from "../../providers/inspection-configuration/inspection-configuration";

@IonicPage()
@Component({
    selector: 'page-intervention-general',
    templateUrl: 'intervention-general.html',
})
export class InterventionGeneralPage implements OnDestroy {

    public planForm: FormGroup;
    public planSubscription: ISubscription;
    public controllerPlanSubscription: ISubscription;
    public idLaneTransversal: string;
    public laneName: string;
    public utilisationCodeName: string;
    public statusText: string;
    public startVisible = false;
    public labels = {};
    public userAllowed = true;

    get plan(): InspectionDetail {
        return this.controller.inspectionDetail
    }

    public riskLevel: RiskLevel;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private fb: FormBuilder,
                private controller: InspectionControllerProvider,
                private riskLevelService: RiskLevelRepositoryProvider,
                public laneService: LaneRepositoryProvider,
                private utilisationCodeService: UtilisationCodeRepositoryProvider,
                public inspectionDetailProvider: InspectionDetailRepositoryProvider,
                private messageTools: MessageToolsProvider,
                private translateService: TranslateService,
                private mapService: MapLocalizationRepositoryService,
                private configService: InspectionConfigurationProvider) {
        this.createForm();
        this.controllerPlanSubscription = controller.planLoaded.subscribe(() =>this.setValuesAndStartListening());
    }

    public ngOnInit() {
        this.translateService.get([
            'surveyRequired','otherUserInspection'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public ngOnDestroy(): void {
        if (this.planSubscription) {
            this.planSubscription.unsubscribe();
        }

        if (this.controllerPlanSubscription) {
            this.controllerPlanSubscription.unsubscribe();
        }
    }

    public ionViewDidLoad() {
        this.controller.loadInterventionForm();
    }

    public setValuesAndStartListening() {
        this.canUserAccessInspection();
        this.idLaneTransversal = this.plan.idLaneTransversal;
        this.setValues();
        this.loadRiskLevel();
        this.loadLaneName();
        this.loadUtilisationCode();
        this.startWatchingForm();

        this.validInspectionStatus();

        this.setBuildingPosition();
        this.setCityPosition();
    }

    private setBuildingPosition(){
        this.mapService.setBuildingPosition(this.plan.coordinates);
    }
    private setCityPosition(){
        this.mapService.setInspectionCity(this.plan.idCity);
    }

    public createForm() {
        this.planForm = this.fb.group({
            idLaneTransversal: ['']
        });
    }

    public loadRiskLevel() { // why am i loading this exactly?
        if (this.plan != null) {
            this.riskLevelService.getById(this.plan.mainBuildingIdRiskLevel)
                .subscribe(
                    result =>
                    {
                        this.riskLevel = result;
                    });
        }
    }

    public loadLaneName() {
        if (this.plan != null) {
            this.laneService.getDescriptionById(this.plan.mainBuildingIdLane)
                .subscribe(result => this.laneName = result);
        }
    }

    public loadUtilisationCode() {
        if (this.plan != null) {
            this.utilisationCodeService.get(this.plan.mainBuildingIdUtilisationCode)
                .subscribe(result => this.utilisationCodeName = result.name);
        }
    }

    private startWatchingForm() {
        this.planSubscription = this.planForm.valueChanges
            .debounceTime(500)
            .subscribe(() => this.saveIfValid());
    }

    private setValues() {
        if (this.plan != null) {
            this.planForm.patchValue(this.plan);
        }
    }

    private saveIfValid() {
        if (this.planForm.valid && this.planForm.dirty) {
            this.saveForm();
        }
    }

    private saveForm() {
        const formModel = this.planForm.value;
        Object.assign(this.controller.inspectionDetail, formModel);
        this.controller.savePlanTransversal();
    }

    private validInspectionStatus() {
        if (this.plan.status == this.inspectionDetailProvider.InspectionStatusEnum.Refused) {
            this.startVisible = true;
        } else {
            if (this.plan.status == this.inspectionDetailProvider.InspectionStatusEnum.Todo) {
                this.startVisible = true;
            } else if (this.plan.status == this.inspectionDetailProvider.InspectionStatusEnum.Started) {
                this.startVisible = false;
            } else if (this.plan.status == this.inspectionDetailProvider.InspectionStatusEnum.WaitingForApprobation) {
                this.startVisible = false;
            }
        }
        this.statusText = this.inspectionDetailProvider.getInspectionStatusText(this.plan.status);
    }

    private validateSurveyNavigation(){
        if (this.controller.inspectionDetail.idSurvey) {
            if (this.controller.inspectionDetail.isSurveyCompleted) {
                this.navCtrl.push('InspectionQuestionSummaryPage', {idInspection: this.controller.idInspection});
            }
            else {
                this.navCtrl.push('InspectionQuestionPage', {
                    idInspection: this.controller.idInspection,
                    inspectionSurveyCompleted: this.controller.inspectionDetail.isSurveyCompleted
                });
            }
        }
    }

    public async startInspection() {
        let canStart =  await this.canUserAccessInspection();
        if(canStart){
            this.inspectionDetailProvider.startInspection(this.controller.idInspection)
                .subscribe(success => {
                    this.controller.loadInterventionForm();
                    this.validateSurveyNavigation();
                },
                    error=>{
                    console.log("Error in startInspection",error);
                    });
        }
    }

    public async absentVisit() {
       let canCancel =  await this.canUserAccessInspection();
       if(canCancel){
           this.navCtrl.push('InspectionVisitPage', {ownerAbsent: true});
        }
    }

    public async refuseVisit() {
        let canRefuse =  await this.canUserAccessInspection();
        if(canRefuse){
            this.navCtrl.push('InspectionVisitPage', {ownerAbsent: false});
        }
    }

    public completeInspection() {
        let canComplete = true;
        if (this.controller.inspectionDetail.idSurvey) {
            if (!this.controller.inspectionDetail.isSurveyCompleted) {
                canComplete = false;
                this.messageTools.showToast(this.labels['surveyRequired']);
            }
        }
        if (canComplete) {
            this.inspectionDetailProvider.completeInspection(this.controller.idInspection)
                .subscribe(
                    success => {
                        this.navCtrl.setRoot('InspectionListPage');
                        this.navCtrl.popToRoot();
                    },
                    error => {
                        this.messageTools.showToast('Une erreur est survenue dans le processus de finalisation de l\'inspection, veuillez réessayer ultérieurement.');
                    });
        }
    }

    private async canUserAccessInspection(){
        if(this.plan.status != this.inspectionDetailProvider.InspectionStatusEnum.Started){
            this.userAllowed = false;
            this.configService.disableMenu();
            return false;
        }else {
         return await this.inspectionDetailProvider.CanUserAccessInspection(this.controller.idInspection)
                .then(
                    () => {
                        this.userAllowed = true;
                        this.configService.activateMenu();
                    }, () => {
                        this.userAllowed = false;
                        this.configService.disableMenu();
                    })
             .catch(error=>{console.log("Error in CanUserAccessInspection", error)});
        }
    }
}
