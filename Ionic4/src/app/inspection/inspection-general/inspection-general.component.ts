import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Inspection } from 'src/app/shared/interfaces/inspection.interface';
import { RiskLevel } from 'src/app/shared/models/risk-level';
import { LoadingController, ModalController } from '@ionic/angular';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { RiskLevelRepositoryProvider } from 'src/app/core/services/repositories/risk-level-repository';
import { LaneRepositoryProvider } from 'src/app/core/services/repositories/lane-repository';
import { InspectionRepositoryProvider } from 'src/app/core/services/repositories/inspection-repository-provider.service';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { TranslateService } from '@ngx-translate/core';
import { InspectionConfigurationProvider } from 'src/app/core/services/controllers/inspection-configuration/inspection-configuration';
import { debounceTime } from 'rxjs/operators';
import { InspectionVisitComponent } from '../components/inspection-visit/inspection-visit.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspection-general',
  templateUrl: './inspection-general.component.html',
  styleUrls: ['./inspection-general.component.scss'],
})
export class InspectionGeneralComponent implements OnInit, OnDestroy {

  public planForm: FormGroup;
  public planSubscription: Subscription;
  public controllerPlanSubscription: Subscription;
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

  public get canBeEdited(): boolean {
    return this.controller.currentInspection != null
    && this.controller.currentInspection.status === this.inspectionRepo.inspectionStatusEnum.Started 
    && !this.canTransmitInspectionToServer;
  }

  public get inspectionIsLoaded(): boolean {
    return this.controller.inspectionIsLoaded = true;
  }

  public riskLevel: RiskLevel;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public controller: InspectionControllerProvider,
    private riskLevelService: RiskLevelRepositoryProvider,
    public laneService: LaneRepositoryProvider,
    private inspectionRepo: InspectionRepositoryProvider,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private messageTools: MessageToolsProvider,
    private translateService: TranslateService,
    private configService: InspectionConfigurationProvider
  ) {
    this.createForm();
    this.setValuesAndStartListening();
  }

  async ngOnInit() {
    this.translateService.get([
      'surveyRequired', 'otherUserInspection', 'cantStartBecauseCantDownloadAndApiUnavailable',
      'cantUploadAndCompleteInspection', 'loading'])
      .subscribe(
        labels => this.labels = labels,
        error => console.log(error));
  }

  ngOnDestroy(): void {
    if (this.planSubscription) {
      this.planSubscription.unsubscribe();
    }

    if (this.controllerPlanSubscription) {
      this.controllerPlanSubscription.unsubscribe();
    }
  }

  public async setValuesAndStartListening() {
    await this.userAccessValidation();
    this.refreshUserPermission = false;
    await this.loadRiskLevel();
    this.startWatchingForm();
    this.refreshInspection();
  }

  private refreshInspection() {
    this.validInspectionStatus();

    if (this.controller.getMainBuilding() != null) {
      this.setValues();
    }
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
      .pipe(debounceTime(500))
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
      && this.controller.inspection.currentVisit.status === this.inspectionRepo.inspectionVisitStatusEnum.Completed;
  }

  private visitCanBeStarted() {
    return this.currentInspection.status === this.inspectionRepo.inspectionStatusEnum.Refused
      || (!this.canTransmitInspectionToServer && this.currentInspection.status === this.inspectionRepo.inspectionStatusEnum.Todo);
  }

  private async validateSurveyNavigation() {
    if (this.controller.inspection.idSurvey) {
      if (this.controller.inspection.isSurveyCompleted) {
        // await this.navCtrl.push('InspectionSurveySummaryPage', {idInspection: this.controller.idInspection});
        console.log('sommaire');
      } else {
        /*await this.navCtrl.push('InspectionSurveyAnswerPage', {
          idInspection: this.controller.idInspection,
          inspectionSurveyCompleted: this.controller.inspection.isSurveyCompleted
        });*/
        console.log('sommaire');
      }
    }
  }

  private async showLoadingControl(): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingController.create({ message: this.labels['loading'] });
    await loading.present();
    return loading;
  }

  public async startInspection() {
    const canStart = await this.canUserAccessInspection();
    if (canStart) {
      const loading = await this.showLoadingControl();
      const hasAlreadyBeenDownloaded = await this.inspectionRepo.hasBeenDownloaded(this.controller.idInspection);
      if (hasAlreadyBeenDownloaded) {
        await this.startInspectionAndRefreshForm();
        await loading.dismiss();
      } else {
        const hasBeenDownloaded = await this.controller.downloadCurrentInspection();
        if (hasBeenDownloaded) {
          await this.startInspectionAndRefreshForm();
          await loading.dismiss();
        } else {
          await loading.dismiss();
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

  public async uploadInspectionToServer() {
    await this.completeAndUploadInspection();
  }

  public async absentVisit() {
    const canCancel = await this.canUserAccessInspection();
    if (canCancel) {
      await this.showVisitPage(true);
    }
  }

  public async refuseVisit() {
    const canRefuse = await this.canUserAccessInspection();
    if (canRefuse) {
      await this.showVisitPage(false);
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
          await loading.dismiss();
          if (!wasFullyCompleted) {
            await this.messageTools.showToast(this.labels['cantUploadAndCompleteInspection']);
          }

          await this.router.navigate(['/inspection-list']);
        },
        async () => {
          await loading.dismiss();
          await this.messageTools.showToast(this.labels['cantUploadAndCompleteInspection']);
        }
      );
  }

  private async showVisitPage(ownerAbsent: boolean): Promise<void> {
    const modal = await this.modalController.create({
      component: InspectionVisitComponent,
      componentProps: {
        ownerAbsent
      }
    });

    await modal.present();
  }

  private async userAccessValidation() {
    if (!this.refreshUserPermission) {
      if (this.controller.inspection.status !== this.inspectionRepo.inspectionStatusEnum.Started) {
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
        console.log('Error in CanUserAccessInspection', error);
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
