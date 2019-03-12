import {Component} from '@angular/core';
import {
  IonicPage,
  Loading,
  LoadingController,
  MenuController,
  NavController,
  NavParams, ToastController,
} from 'ionic-angular';
import {RiskLevel} from '../../models/risk-level';
import {Inspection} from '../../interfaces/inspection.interface';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {Batch} from '../../models/batch';
import {InspectionRepositoryProvider} from '../../providers/repositories/inspection-repository-provider.service';
import {TranslateService} from "@ngx-translate/core";
import {InspectionConfigurationProvider} from '../../providers/inspection-configuration/inspection-configuration';
import {OfflineDataSynchronizerProvider} from "../../providers/offline-data-synchronizer/offline-data-synchronizer";
import {InspectionControllerProvider} from "../../providers/inspection-controller/inspection-controller";

@IonicPage()
@Component({
    selector: 'page-inspection-list',
    templateUrl: 'inspection-list.html'
})
export class InspectionListPage {
  private loading: Loading;

  public batches: Batch[];
  public filteredBatches: Batch[];
  public riskLevels: RiskLevel[];
  public searchTerm: string = "";
  public rootPage: string = "InterventionHomePage";
  public noDataMessage = "";
  public labels = {};
  public dataIsCorrectlyLoaded: boolean = false;

  get isSynching(): boolean {
    return this.synchronizer.isSynching;
  }

  get synchingPercentCompleted(): number {
    return this.synchronizer.percentCompleted;
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private synchronizer: OfflineDataSynchronizerProvider,
              private riskLevelService: RiskLevelRepositoryProvider,
              private loadingCtrl: LoadingController,
              private inspectionService: InspectionRepositoryProvider,
              private menu: MenuController,
              private toast: ToastController,
              private configuration: InspectionConfigurationProvider,
              private controller: InspectionControllerProvider,
              private translateService: TranslateService) {
  }

  public async ngOnInit() {
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

  private getAllCityIds(): string[]{
    const cityIds = [];
    this.batches.forEach(batch => {
      batch.inspections.forEach(inspection => {
        if (cityIds.every(id => id != inspection.idCity)){
          cityIds.push(inspection.idCity);
        }
      })
    });

    return cityIds;
  }

  public async refreshList(refresher) {
    await this.loadData();
    refresher.complete();
  }

  public async ionViewCanEnter() {
    this.menu.enable(false, 'inspectionMenu');
    this.menu.enable(false, 'buildingMenu');
    this.menu.enable(true, 'inspectionListMenu');
  }

  private async showLoadingControl() {
    this.loading = this.loadingCtrl.create({content: this.labels['loading']});
    await this.loading.present();
  }

  private hideLoadingControl() {
    this.loading.dismissAll();
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
            return await this.navCtrl.push('InterventionHomePage', {id: idInspection});
          }else{
            await this.displayLoadingError(this.labels['cantOpenInspection']);
          }
        },
        ()=> this.displayLoadingError(this.labels['cantOpenInspection']));
  }

  private displayLoadingError(message: string){
    const toast = this.toast.create({
      message: message,
      duration: 3000,
      position: 'middle'
    });

    return toast.present();
  }

  public async downloadBatch(event, batch: Batch) {
    event.stopPropagation();
    if (batch.notDownloadedInspectionIds != null && batch.notDownloadedInspectionIds.length > 0) {
      await this.synchronizer.downloadInspections(batch.notDownloadedInspectionIds)
        .then(async (hasBeenDownloaded) => {
          if (hasBeenDownloaded) {
            batch.notDownloadedInspectionIds.forEach(id => {
              const foundInspection = batch.inspections.find(inspection => inspection.id == id);
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

  public async downloadInspection(event, inspection: Inspection, batch: Batch) {
    event.stopPropagation();
    this.synchronizer.downloadInspections([inspection.id])
      .then(async(wasSuccessful) => {
        if (wasSuccessful) {
          inspection.hasBeenDownloaded = true;
          batch.notDownloadedInspectionIds = batch.notDownloadedInspectionIds.filter(id => id != inspection.id);
          batch.hasBeenFullyDownloaded = batch.notDownloadedInspectionIds.length == 0;
        } else {
          await this.displayLoadingError(this.labels['cantDownloadInspection']);
        }
      });
  }

  public filterList() {
    if (this.searchTerm && this.searchTerm != '')
      this.applyFilter();
    else
      this.filteredBatches = this.batches;
  }

  private applyFilter() {
    this.filteredBatches = JSON.parse(JSON.stringify(this.batches));
    this.filteredBatches.forEach((batch: Batch) => {
      batch.inspections = batch.inspections.filter(inspection => this.mustBeShown(inspection));
    });
    this.filteredBatches = this.filteredBatches.filter(batch => batch.inspections.length > 0);
  }

  private mustBeShown(inspection: Inspection): boolean {
    let riskLevelName = this.getRiskDescription(inspection.idRiskLevel);
    let riskContainsSearchTerm = riskLevelName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    const address = inspection.civicNumber + inspection.civicLetter + ', ' + inspection.laneName;
    let addressContainsSearchTerm = address.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    let batchDescriptionContainsSearchTerm = inspection.batchDescription.toLowerCase()
      .indexOf(this.searchTerm.toLowerCase()) > -1;
    return riskContainsSearchTerm || addressContainsSearchTerm || batchDescriptionContainsSearchTerm;
  }
}
