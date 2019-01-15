import {Component} from '@angular/core';
import {
  IonicPage,
  Loading,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
} from 'ionic-angular';
import {RiskLevel} from '../../models/risk-level';
import {Inspection} from '../../interfaces/inspection.interface';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {Batch} from '../../models/batch';
import {InspectionRepositoryProvider} from '../../providers/repositories/inspection-repository-provider.service';
import {TranslateService} from "@ngx-translate/core";
import {InspectionConfigurationProvider} from '../../providers/inspection-configuration/inspection-configuration';
import {OfflineDataSynchronizerProvider} from "../../providers/offline-data-synchronizer/offline-data-synchronizer";
import {InspectionDetailRepositoryProvider} from "../../providers/repositories/inspection-detail-repository-provider.service";
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
              private inspectionDetailRepo: InspectionDetailRepositoryProvider,
              private synchronizer: OfflineDataSynchronizerProvider,
              private riskLevelService: RiskLevelRepositoryProvider,
              private loadingCtrl: LoadingController,
              private inspectionService: InspectionRepositoryProvider,
              private menu: MenuController,
              private configuration: InspectionConfigurationProvider,
              private controller: InspectionControllerProvider,
              private translateService: TranslateService) {
  }

  public async ngOnInit() {
    await this.loadInitialData();
    this.loadLocalization();
  }

  public getStatusDescription(status: number): string {
    return this.inspectionDetailRepo.getInspectionStatusText(status);
  }

  private loadLocalization() {
    this.translateService.get([
      'loading', 'surveyUnassignedMessage'
    ]).subscribe(labels => {
      this.labels = labels;
    });
    this.noDataMessage = this.labels['surveyUnassignedMessage'];
  }

  private async loadInitialData() {
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
          this.synchronizer.synchronizingLanes(this.getAllCityIds())
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

  public refreshList(refresher) {
    if (this.dataIsCorrectlyLoaded) {
      this.inspectionService.getAll()
        .then(batches => {
          this.batches = batches;
          this.filterList();
          this.synchronizer.synchronizingLanes(this.getAllCityIds())
            .then(() => {
              this.filterList();
              refresher.complete();
            });
        }, () => refresher.complete());
    } else {
      refresher.complete();
      this.loadInitialData();
    }
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
      return InspectionListPage.toColor(result.color);
    } else {
      return 'black';
    }
  }

  static toColor(num) {
    num >>>= 0;
    let b = num & 0xFF,
      g = (num & 0xFF00) >>> 8,
      r = (num & 0xFF0000) >>> 16,
      a = ((num & 0xFF000000) >>> 24) / 255;
    return "rgba(" + [r, g, b, a].join(",") + ")";
  }

  public async openInspection(idInspection: string) {
    await this.configuration.loadConfiguration(idInspection);
    await this.navCtrl.push('InterventionHomePage', {id: idInspection});
  }

  public async downloadInspection(event, inspection: Inspection) {
    event.stopPropagation();
    await this.synchronizer.downloadInspections([inspection.id]);
    inspection.hasBeenDownloaded = true;
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
