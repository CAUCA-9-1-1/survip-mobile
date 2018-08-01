import {Component, OnDestroy} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RiskLevel} from '../../models/risk-level';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {ISubscription} from 'rxjs/Subscription';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionForm} from '../../models/intervention-form';
import {UtilisationCodeRepositoryProvider} from '../../providers/repositories/utilisation-code-repository';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionDetailRepositoryProvider} from "../../providers/repositories/inspection-detail-repository-provider.service";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-intervention-general',
    templateUrl: 'intervention-general.html',
})
export class InterventionGeneralPage implements OnDestroy {

    planForm: FormGroup;
    planSubscription: ISubscription;
    controllerPlanSubscription: ISubscription;
    idLaneTransversal: string;
    laneName: string;
    utilisationCodeName: string;
    statusText: string;
    startVisible: boolean = false;
    labels = {};

    get plan(): InspectionDetail {
        return this.controller.inspectionDetail
    }

    riskLevel: RiskLevel;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private fb: FormBuilder,
                private authService: AuthenticationService,
                private controller: InspectionControllerProvider,
                private riskLevelService: RiskLevelRepositoryProvider,
                public laneService: LaneRepositoryProvider,
                private utilisationCodeService: UtilisationCodeRepositoryProvider,
                public inspectionDetailProvider: InspectionDetailRepositoryProvider,
                private messageTools: MessageToolsProvider,
                private translateService: TranslateService) {
        this.createForm();
        this.controllerPlanSubscription = controller.planLoaded.subscribe(() => this.setValuesAndStartListening());
    }

    ngOnInit() {
        this.translateService.get([
            'surveyRequired'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    ngOnDestroy(): void {
        if (this.planSubscription)
            this.planSubscription.unsubscribe();

        if (this.controllerPlanSubscription)
            this.controllerPlanSubscription.unsubscribe();
    }

    ionViewDidLoad() {
        this.controller.loadInterventionForm();
    }

    async ionViewCanEnter() {
        let isLoggedIn = await this.authService.isStillLoggedIn();
        if (!isLoggedIn)
            this.redirectToLoginPage();
    }

    private redirectToLoginPage() {
        this.navCtrl.setRoot('LoginPage');
    }

    setValuesAndStartListening() {
        this.idLaneTransversal = this.plan.idLaneTransversal;
        this.setValues();
        this.loadRiskLevel();
        this.loadLaneName();
        this.loadUtilisationCode();
        this.startWatchingForm();

        this.validInspectionStatus();
    }

    createForm() {
        this.planForm = this.fb.group({
            idLaneTransversal: ['']
        });
    }

    loadRiskLevel() { // why am i loading this exactly?
        if (this.plan != null) {
            this.riskLevelService.getById(this.plan.mainBuildingIdRiskLevel)
                .subscribe(result => this.riskLevel = result);
        }
    }

    loadLaneName() {
        if (this.plan != null) {
            this.laneService.getDescriptionById(this.plan.mainBuildingIdLane)
                .subscribe(result => this.laneName = result);
        }
    }

    loadUtilisationCode() {
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
            this.statusText = this.plan.approbationRefusalReason;
        } else {
            if (this.plan.status == this.inspectionDetailProvider.InspectionStatusEnum.Todo) {
                this.startVisible = true;
            } else if (this.plan.status == this.inspectionDetailProvider.InspectionStatusEnum.Started) {
                this.startVisible = false;
            } else if (this.plan.status == this.inspectionDetailProvider.InspectionStatusEnum.WaitingForApprobation) {
                this.startVisible = false;
            }
            this.statusText = this.inspectionDetailProvider.getInspectionStatusText(this.plan.status);
        }

    }

    public startInspection() {
        this.inspectionDetailProvider.startInspection(this.controller.idInspection)
            .subscribe(success => {
                this.controller.loadInterventionForm();
                if (this.controller.inspectionDetail.idSurvey) {
                    this.navCtrl.push('InspectionQuestionPage', {
                        idInspection: this.controller.idInspection,
                        inspectionSurveyCompleted: this.controller.inspectionDetail.isSurveyCompleted
                    });
                }
            }, error => {
                this.messageTools.showToast('Une erreur est survenue dans le processus de démarrage de l\'inspection, veuillez réessayer ultérieurement.');
            });
    }

    public absentVisit() {
        this.navCtrl.push('InspectionVisitPage', {ownerAbsent: true});
    }

    public refuseVisit() {
        this.navCtrl.push('InspectionVisitPage', {ownerAbsent: false});
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
}
