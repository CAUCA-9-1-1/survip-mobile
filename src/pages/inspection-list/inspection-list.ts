import {Component} from '@angular/core';
import {IonicPage, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import {RiskLevel} from '../../models/risk-level';
import {Inspection} from '../../interfaces/inspection.interface';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {InterventionHomePage} from '../intervention-home/intervention-home';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {Batch} from '../../models/batch';
import {InspectionRepositoryProvider} from '../../providers/repositories/inspection-repository-provider.service';
import {TranslateService} from "@ngx-translate/core";
import {InspectionConfigurationProvider} from '../../providers/inspection-configuration/inspection-configuration';
import {OfflineDataSynchronizerProvider} from "../../providers/offline-data-synchronizer/offline-data-synchronizer";

@IonicPage()
@Component({
    selector: 'page-inspection-list',
    templateUrl: 'inspection-list.html'
})
export class InspectionListPage {
    public batches: Batch[];
    public filteredBatches: Batch[];
    public riskLevels: RiskLevel[];
    public searchTerm: string = "";
    public rootPage: string = "InterventionHomePage";
    public noDataMessage = "";
    public labels = {};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private synchronizer: OfflineDataSynchronizerProvider,
                private riskLevelService: RiskLevelRepositoryProvider,
                private loadingCtrl: LoadingController,
                private inspectionService: InspectionRepositoryProvider,
                private authService: AuthenticationService,
                private menu: MenuController,
                private configuration: InspectionConfigurationProvider,
                private translateService: TranslateService) {
    }

    public async ngOnInit() {

      const loading = this.createLoadingControl();
      await loading.present();

        this.synchronizer.synchronizeBaseEntities()
          .then(async (value: boolean) => {
            this.riskLevels = await this.riskLevelService.getAll();

            this.inspectionService.getAll()
              .subscribe(batches => {
                this.batches = batches;
                this.filterList();
                loading.dismiss();
              });
          });

      this.translateService.get([
            'loading', 'surveyUnassignedMessage'
        ]).subscribe(labels => {
            this.labels = labels;
        });
        this.noDataMessage = this.labels['surveyUnassignedMessage'];
    }


    public refreshList(refresher) {
        this.inspectionService.getAll()
            .subscribe(batches => {
                this.batches = batches;
                this.filterList();
                refresher.complete();
            },() => refresher.complete());
    }

    public async ionViewCanEnter() {
        this.menu.enable(false, 'inspectionMenu');
        this.menu.enable(false, 'buildingMenu');
        this.menu.enable(true, 'inspectionListMenu');
    }

    private createLoadingControl() {
        return this.loadingCtrl.create({content: this.labels['loading']});
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

    public async itemSelected(inspection: Inspection) {
        await this.configuration.loadConfiguration(inspection.id);
        this.navCtrl.push('InterventionHomePage', {id: inspection.id});
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
        let addressContainsSearchTerm = inspection.address.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        let batchDescriptionContainsSearchTerm = inspection.batchDescription.toLowerCase()
            .indexOf(this.searchTerm.toLowerCase()) > -1;
        return riskContainsSearchTerm || addressContainsSearchTerm || batchDescriptionContainsSearchTerm;
    }
}
