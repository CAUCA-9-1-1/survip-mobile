import { Component, OnInit } from '@angular/core';
import { Batch } from '../shared/models/batch';
import { OfflineDataSynchronizerProvider } from '../core/services/controllers/offline-data-synchronizer/offline-data-synchronizer';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { InspectionRepositoryProvider } from '../core/services/repositories/inspection-repository-provider.service';
import { InspectionControllerProvider } from '../core/services/controllers/inspection-controller/inspection-controller';
import { TranslateService } from '@ngx-translate/core';
import { Inspection } from '../shared/interfaces/inspection.interface';
import { Router } from '@angular/router';
import { InspectionListControllerProvider } from '../core/services/controllers/inspection-list-controller/inspection-list-controller';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.page.html',
  styleUrls: ['./inspection-list.page.scss'],
})
export class InspectionListPage implements OnInit {

  private loading: HTMLIonLoadingElement;

  public rootPage: string = 'InterventionHomePage';
  public noDataMessage = '';
  public labels = {};

  public get dataIsCorrectlyLoaded(): boolean {
    return this.inspectionListController.dataIsCorrectlyLoaded;
  }

  public get searchTerm(): string {
    return this.inspectionListController.searchTerm;
  }

  public set searchTerm(value: string) {
    this.inspectionListController.searchTerm = value;
  }

  get isSynching(): boolean {
    return this.synchronizer.isSynching;
  }

  public get filteredBatches(): Batch[] {
    return this.inspectionListController.filteredBatches;
  }

  get synchingPercentCompleted(): number {
    return this.synchronizer.percentCompleted;
  }

  constructor(
    public inspectionListController: InspectionListControllerProvider,
    private inspectionService: InspectionRepositoryProvider,
    private synchronizer: OfflineDataSynchronizerProvider,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private router: Router,
    private controller: InspectionControllerProvider,
    private translateService: TranslateService) {
  }

  async ngOnInit() {
    await this.loadData();
    this.loadLocalization();
  }

  public getStatusDescription(status: number): string {
    return this.inspectionService.getInspectionStatusText(status);
  }

  public getRiskDescription(idRiskLevel: string): string {
    return this.inspectionListController.getRiskDescription(idRiskLevel);
  }

  private loadLocalization() {
    this.translateService.get([
      'loading', 'surveyUnassignedMessage', 'cantDownloadBatch', 'cantOpenInspection', 'cantDownloadInspection'
    ]).subscribe(labels => {
      this.labels = labels;
    });
    this.noDataMessage = this.labels['surveyUnassignedMessage'];
  }

  private async loadData() {
    await this.showLoadingControl();
    await this.loadInspectionList()
      .then(() => this.hideLoadingControl());
  }

  private loadInspectionList(): Promise<void> {
    return this.inspectionListController.refreshInspectionList();
  }

  public async refreshList(refresher) {
    await this.loadData();
    refresher.target.complete();
  }

  private async showLoadingControl() {
    this.loading = await this.loadingCtrl.create({message: this.labels['loading']});
    await this.loading.present();
  }

  private async hideLoadingControl() {
    await this.loading.dismiss();
    this.loading = null;
  }

  public getRiskColor(idRiskLevel: string): string {
    return this.inspectionListController.getRiskColor(idRiskLevel);
  }

  public async openInspection(idInspection: string) {
    this.controller.setIdInspection(idInspection, true)
      .then(async (success) => {
          if (success) {
            // return await this.navCtrl.push('InterventionHomePage', {id: idInspection});
          } else {
            await this.displayLoadingError(this.labels['cantOpenInspection']);
          }
        },
        () => this.displayLoadingError(this.labels['cantOpenInspection']));
  }

  private async displayLoadingError(message: string): Promise<void> {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      position: 'middle'
    });

    return toast.present();
  }

  public async downloadBatch(batch: Batch, e: any) {
    e.stopPropagation();
    if (batch.notDownloadedInspectionIds != null && batch.notDownloadedInspectionIds.length > 0) {
      await this.synchronizer.downloadInspections(batch.notDownloadedInspectionIds)
        .then(async (hasBeenDownloaded) => {
          if (hasBeenDownloaded) {
            batch.notDownloadedInspectionIds.forEach(id => {
              const foundInspection = batch.inspections.find(inspection => inspection.id === id);
              if (foundInspection) {
                foundInspection.hasBeenDownloaded = true;
              }
            });
            batch.notDownloadedInspectionIds = [];
            batch.hasBeenFullyDownloaded = true;
          } else {
            await this.displayLoadingError(this.labels['cantDownloadBatch']);
          }
        });
    }
  }

  public async downloadInspection(inspection: Inspection, batch: Batch, e: any) {
    e.stopPropagation();
    this.synchronizer.downloadInspections([inspection.id])
      .then(async (wasSuccessful) => {
        if (wasSuccessful) {
          inspection.hasBeenDownloaded = true;
          batch.notDownloadedInspectionIds = batch.notDownloadedInspectionIds.filter(id => id !== inspection.id);
          batch.hasBeenFullyDownloaded = batch.notDownloadedInspectionIds.length === 0;
        } else {
          await this.displayLoadingError(this.labels['cantDownloadInspection']);
        }
      });
  }

  public async goToPage(idInspection: string) {
    await this.router.navigate(['/inspection/' + idInspection]);
  }
}
