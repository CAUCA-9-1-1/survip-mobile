import { Component, OnInit } from '@angular/core';
import { RiskLevel } from '../shared/models/risk-level';
import { Batch } from '../shared/models/batch';
import { OfflineDataSynchronizerProvider } from '../core/services/controllers/offline-data-synchronizer/offline-data-synchronizer';
import { RiskLevelRepositoryProvider } from '../core/services/repositories/risk-level-repository';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { InspectionRepositoryProvider } from '../core/services/repositories/inspection-repository-provider.service';
import { InspectionControllerProvider } from '../core/services/controllers/inspection-controller/inspection-controller';
import { TranslateService } from '@ngx-translate/core';
import { Inspection } from '../shared/interfaces/inspection.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inspection-list',
  templateUrl: './inspection-list.page.html',
  styleUrls: ['./inspection-list.page.scss'],
})
export class InspectionListPage implements OnInit {

  private loading: HTMLIonLoadingElement;

  public batches: Batch[];
  public filteredBatches: Batch[];
  public riskLevels: RiskLevel[];
  public searchTerm: string = '';
  public rootPage: string = 'InterventionHomePage';
  public noDataMessage = '';
  public labels = {};
  public dataIsCorrectlyLoaded: boolean = false;

  get isSynching(): boolean {
    return this.synchronizer.isSynching;
  }

  get synchingPercentCompleted(): number {
    return this.synchronizer.percentCompleted;
  }

  constructor(
    private synchronizer: OfflineDataSynchronizerProvider,
    private riskLevelService: RiskLevelRepositoryProvider,
    private loadingCtrl: LoadingController,
    private inspectionService: InspectionRepositoryProvider,
    private menu: MenuController,
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
    this.synchronizer.synchronizeBaseEntities()
      .then((wasSuccessful: boolean) => {
        this.dataIsCorrectlyLoaded = wasSuccessful;
        if (this.dataIsCorrectlyLoaded) {
          this.riskLevelService.getAll()
            .then(risks => this.riskLevels = risks);
          this.loadInspectionList();
        } else {
          this.hideLoadingControl();
        }
      });
  }

  private loadInspectionList() {
    this.inspectionService.getAll()
      .then(batches => {
          this.batches = batches;
          this.synchronizer.synchronizingCities(this.getAllCityIds())
            .then(() => {
              this.filterList();
              this.hideLoadingControl();
            });
        },
        () => {
          this.dataIsCorrectlyLoaded = false;
          this.hideLoadingControl();
        }
      );
  }

  private getAllCityIds(): string[] {
    const cityIds = [];
    this.batches.forEach(batch => {
      batch.inspections.forEach(inspection => {
        if (cityIds.every(id => id !== inspection.idCity)) {
          cityIds.push(inspection.idCity);
        }
      });
    });

    return cityIds;
  }

  public async refreshList(refresher) {
    await this.loadData();
    refresher.target.complete();
  }

  public async ionViewCanEnter() {
    this.menu.enable(false, 'inspectionMenu');
    this.menu.enable(false, 'buildingMenu');
    this.menu.enable(true, 'inspectionListMenu');
  }

  private async showLoadingControl() {
    this.loading = await this.loadingCtrl.create({message: this.labels['loading']});
    await this.loading.present();
  }

  private async hideLoadingControl() {
    await this.loading.dismiss();
    this.loading = null;
  }

  public getRiskDescription(idRiskLevel: string): string {
    const result = this.riskLevels.find(risk => risk.id === idRiskLevel);
    if (result != null) {
      return result.name;
    } else {
      return '';
    }
  }

  public getRiskColor(idRiskLevel: string): string {
    const result = this.riskLevels.find(risk => risk.id === idRiskLevel);
    if (result != null) {
      return result.color;
    } else {
      return 'black';
    }
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

  public filterList() {
    if (this.searchTerm && this.searchTerm !== '') {
      this.applyFilter();
    } else {
      this.filteredBatches = this.batches;
    }
  }

  public async goToPage(idInspection: string) {
    await this.router.navigate(['/inspection/' + idInspection]);
  }

  private applyFilter() {
    this.filteredBatches = JSON.parse(JSON.stringify(this.batches));
    this.filteredBatches.forEach((batch: Batch) => {
      batch.inspections = batch.inspections.filter(inspection => this.mustBeShown(inspection));
    });
    this.filteredBatches = this.filteredBatches.filter(batch => batch.inspections.length > 0);
  }

  private mustBeShown(inspection: Inspection): boolean {
    const riskLevelName = this.getRiskDescription(inspection.idRiskLevel);
    const riskContainsSearchTerm = riskLevelName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    const address = inspection.civicNumber + inspection.civicLetter + ', ' + inspection.laneName;
    const addressContainsSearchTerm = address.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    const batchDescriptionContainsSearchTerm = inspection.batchDescription.toLowerCase()
      .indexOf(this.searchTerm.toLowerCase()) > -1;
    return riskContainsSearchTerm || addressContainsSearchTerm || batchDescriptionContainsSearchTerm;
  }
}
