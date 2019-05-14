import {Component, OnDestroy} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RiskLevel} from '../../models/risk-level';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {ISubscription} from 'rxjs/Subscription';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
import {MapLocalizationRepositoryService} from "../../providers/repositories/map-localisation-repository-service";
import {InspectionConfigurationProvider} from "../../providers/inspection-configuration/inspection-configuration";
import {Inspection} from "../../interfaces/inspection.interface";
import {InspectionRepositoryProvider} from "../../providers/repositories/inspection-repository-provider.service";

@IonicPage()
@Component({
    selector: 'page-intervention-general',
    templateUrl: 'intervention-general.html',
})
export class InterventionGeneralPage implements OnDestroy {

  public planForm: FormGroup;
  public planSubscription: ISubscription;
  public controllerPlanSubscription: ISubscription;
  public statusText: string;
  public canStartInspection: boolean = false;
  public canTransmitInspectionToServer: boolean = false;
  public canRefuseInspection: boolean = false;
  public labels = {};
  public userAllowed = true;
  public refreshUserPermission = false;

  public get currentInspection(): Inspection {
    return this.controller.currentInspection;
  }

  public get canBeEdited(): boolean  {
    return this.controller.currentInspection.status == this.inspectionRepo.inspectionStatusEnum.Started && !this.canTransmitInspectionToServer;
  }

  public riskLevel: RiskLevel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              private controller: InspectionControllerProvider,
              private riskLevelService: RiskLevelRepositoryProvider,
              public laneService: LaneRepositoryProvider,
              private inspectionRepo: InspectionRepositoryProvider,
              private loadingController: LoadingController,
              private messageTools: MessageToolsProvider,
              private translateService: TranslateService,
              //private mapService: MapLocalizationRepositoryService,
              private configService: InspectionConfigurationProvider) {
    this.createForm();
  }

  public ngOnInit() {
        this.translateService.get([
      'surveyRequired', 'otherUserInspection', 'cantStartBecauseCantDownloadAndApiUnavailable', 'cantUploadAndCompleteInspection', 'loading'
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

  public async ionViewDidLoad() {
    await this.setValuesAndStartListening();
  }

  public async setValuesAndStartListening() {
    await this.userAccessValidation();
    this.refreshUserPermission = false;
    await this.loadRiskLevel();
    this.startWatchingForm();
    this.refreshInspection();

    this.setCityPosition();
  }

  private refreshInspection() {
    this.validInspectionStatus();

    if (this.controller.getMainBuilding() != null) {
      this.setValues();
      this.setBuildingPosition();
    }
  }

  private setBuildingPosition() {
//    this.mapService.setBuildingPosition(this.controller.getMainBuilding().coordinates);
  }

  private setCityPosition() {
  //  this.mapService.setInspectionCity(this.controller.currentInspection.idCity);
  }

  public createForm() {
    this.planForm = this.fb.group({
      idLaneTransversal: ['']
    });
  }

  public async loadRiskLevel() { // why am i loading this exactly?
    if (this.currentInspection != null) {
      this.riskLevel = await this.riskLevelService.getById(this.currentInspection.idRiskLevel);
    }
  }

  private startWatchingForm() {
    this.planSubscription = this.planForm.valueChanges
      .debounceTime(500)
      .subscribe(() => this.saveIfValid());
  }

  private setValues() {
    if (this.controller.inspection != null) {
      this.planForm.controls['idLaneTransversal'].patchValue(this.controller.getMainBuilding().idLaneTransversal);
    }
  }

  private saveIfValid() {
    if (this.planForm.valid && this.planForm.dirty) {
      this.saveForm();
    }
  }

  private saveForm() {
    const formModel = this.planForm.value;
    const inspection = this.controller.getMainBuilding();
    inspection.idLaneTransversal = formModel.idLaneTransversal;
    inspection.hasBeenModified = true;
    this.controller.saveBuildings();
  }

  private validInspectionStatus() {
    this.statusText = this.inspectionRepo.getInspectionStatusText(this.controller.currentInspection.status);
    this.canTransmitInspectionToServer = this.visitIsCompletedAndNotTransmitted();
    this.canStartInspection = this.visitCanBeStarted();
    this.canRefuseInspection = this.controller.currentInspection.hasBeenDownloaded && !this.canTransmitInspectionToServer;
    if (this.canTransmitInspectionToServer) {
      this.statusText = this.inspectionRepo.getInspectionStatusText(-1);
    }
  }

  private visitIsCompletedAndNotTransmitted() {
    // the visit is necessarily not transferred if we can enter in the inspection.
    return this.controller.inspection != null && this.controller.inspection.currentVisit != null
      && this.controller.inspection.currentVisit.status == this.inspectionRepo.inspectionVisitStatusEnum.Completed;
  }

  private visitCanBeStarted(){
    return this.currentInspection.status == this.inspectionRepo.inspectionStatusEnum.Refused
      || (!this.canTransmitInspectionToServer && this.currentInspection.status == this.inspectionRepo.inspectionStatusEnum.Todo);
  }

  private async validateSurveyNavigation() {
    if (this.controller.inspection.idSurvey) {
      if (this.controller.inspection.isSurveyCompleted) {
        await this.navCtrl.push('InspectionSurveySummaryPage', {idInspection: this.controller.idInspection});
      } else {
        await this.navCtrl.push('InspectionSurveyAnswerPage', {
          idInspection: this.controller.idInspection,
          inspectionSurveyCompleted: this.controller.inspection.isSurveyCompleted
        });
      }
    }
  }

  private async showLoadingControl(): Promise<Loading> {
    const loading = this.loadingController.create({content: this.labels['loading']});
    await loading.present();
    return loading;
  }

  public async startInspection() {
    let canStart = await this.canUserAccessInspection();
    if (canStart) {
      const loading = await this.showLoadingControl();
      const hasAlreadyBeenDownloaded = await this.inspectionRepo.hasBeenDownloaded(this.controller.idInspection);
      if (hasAlreadyBeenDownloaded) {
        await this.startInspectionAndRefreshForm();
        loading.dismissAll();
      } else {
        const hasBeenDownloaded = await this.controller.downloadCurrentInspection();
        if (hasBeenDownloaded) {
          await this.startInspectionAndRefreshForm();
          loading.dismissAll();
        } else {
          loading.dismissAll();
          await this.messageTools.showToast(this.labels['cantStartBecauseCantDownloadAndApiUnavailable']);
        }
      }
    }
  }

  private async startInspectionAndRefreshForm() {
    await this.inspectionRepo.startInspection(this.controller.idInspection);
    const inspection = await this.inspectionRepo.getInspection(this.controller.idInspection);
    await this.controller.updateCurrentInspection(inspection);
    this.refreshInspection();
    this.manageMenuDisplay(true);
    await this.validateSurveyNavigation();
  }

  public async uploadInspectionToServer(){
    await this.completeAndUploadInspection();
  }

  public async absentVisit() {
    let canCancel = await this.canUserAccessInspection();
    if (canCancel) {
      await this.navCtrl.push('InspectionVisitPage', {ownerAbsent: true});
    }
  }

  public async refuseVisit() {
    let canRefuse = await this.canUserAccessInspection();
    if (canRefuse) {
      await this.navCtrl.push('InspectionVisitPage', {ownerAbsent: false});
    }
  }

  public async completeInspection() {
    let canComplete = true;
    if (this.controller.inspection.idSurvey) {
      if (!this.controller.inspection.isSurveyCompleted) {
        canComplete = false;
        await this.messageTools.showToast(this.labels['surveyRequired']);
      }
    }
    if (canComplete) {
      await this.completeAndUploadInspection();
    }
  }

  private async completeAndUploadInspection() {
    const loading = await this.showLoadingControl();
    this.inspectionRepo.completeInspection(this.controller.idInspection)
      .then(
        async (wasFullyCompleted) => {
          loading.dismissAll();
          if (!wasFullyCompleted) {
            await this.messageTools.showToast(this.labels['cantUploadAndCompleteInspection']);
          }
          await this.navCtrl.setRoot('InspectionListPage');
          await this.navCtrl.popToRoot();
        },
        async () => {
          loading.dismissAll();
          await this.messageTools.showToast(this.labels['cantUploadAndCompleteInspection']);
        }
      );
  }

  private async userAccessValidation() {
    if (!this.refreshUserPermission) {
      if (this.controller.inspection.status != this.inspectionRepo.inspectionStatusEnum.Started) {
        this.manageMenuDisplay(false);
        return false;
      }
      const access = await this.canUserAccessInspection();
      this.manageMenuDisplay(access);
    }
  }

  private async canUserAccessInspection() {
    return await this.inspectionRepo.CanUserAccessInspection(this.controller.idInspection)
      .then(
        (result) => {
          this.userAllowed = result;
          this.refreshUserPermission = true;
          return result;
        })
      .catch(error => {
        console.log("Error in CanUserAccessInspection", error);
        return false;
      });
  }

  manageMenuDisplay(active: boolean) {
    if (active) {
      this.configService.activateMenu();
    } else {
      this.configService.disableMenu();
    }
  }
}
