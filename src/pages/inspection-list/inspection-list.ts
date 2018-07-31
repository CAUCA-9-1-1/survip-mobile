import { Component } from '@angular/core';
import {App, IonicPage, LoadingController, MenuController, NavController, NavParams} from 'ionic-angular';
import {RiskLevel} from '../../models/risk-level';
import {Inspection} from '../../interfaces/inspection.interface';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {InterventionHomePage} from '../intervention-home/intervention-home';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {LoginPage} from '../login/login';
import {Batch} from '../../models/batch';
import {InspectionRepositoryProvider} from '../../providers/repositories/inspection-repository-provider.service';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-inspection-list',
  templateUrl: 'inspection-list.html'
})
export class InspectionListPage {
  batches: Batch[];
  filteredBatches: Batch[];
  riskLevels: RiskLevel[];
  searchTerm: string = "";
  rootPage:string = "InterventionHomePage";
  noDataMessage: string = "Vous n'êtes assigné à aucune inspection.";

  constructor(public appCtrl: App,
              public navCtrl: NavController,
              public navParams: NavParams,
              private riskLevelService: RiskLevelRepositoryProvider,
              private loadingCtrl: LoadingController,
              private inspectionService: InspectionRepositoryProvider,
              private authService: AuthenticationService,
              private menu: MenuController) {
    const loading = this.createLoadingControl();
    loading.present();
    riskLevelService.getAll()
      .subscribe(risks => {
        this.riskLevels = risks;
        inspectionService.getAll()
          .subscribe(batches => {
            this.batches = batches;
            this.filterList();
            loading.dismiss();
          });
      });
  }

  ionViewDidLoad() {
  }

  public refreshList(refresher){
    this.inspectionService.getAll()
      .subscribe(batches => {
        this.batches = batches;
        this.filterList();
        refresher.complete();
      });
  }

  async ionViewCanEnter() {
      this.menu.enable(false, 'inspectionMenu');
      this.menu.enable(false, 'buildingMenu');
      this.menu.enable(true, 'inspectionListMenu');

    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();

  }

  private redirectToLoginPage(){
    this.navCtrl.setRoot('LoginPage');
  }

  private createLoadingControl() {
    return this.loadingCtrl.create({content: 'Chargement...'});
  }

  getRiskDescription(idRiskLevel: string): string {
    const result = this.riskLevels.find(risk => risk.id === idRiskLevel);
    if (result != null) {
      return result.name;
    } else {
      return '';
    }
  }

  getRiskColor(idRiskLevel: string): string {
    const result = this.riskLevels.find(risk => risk.id === idRiskLevel);
    if (result != null) {
      return this.toColor(result.color);
    } else {
      return 'black';
    }
  }

  toColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
      g = (num & 0xFF00) >>> 8,
      r = (num & 0xFF0000) >>> 16,
      a = ( (num & 0xFF000000) >>> 24 ) / 255;
    return "rgba(" + [r, g, b, a].join(",") + ")";
  }

  itemSelected(inspection: Inspection) {
    this.navCtrl.push('InterventionHomePage', { id: inspection.id });
  }

  public filterList(){
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

  private mustBeShown(inspection: Inspection): boolean{
    let riskLevelName = this.getRiskDescription(inspection.idRiskLevel);
    let riskContainsSearchTerm = riskLevelName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    let addressContainsSearchTerm = inspection.address.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    let batchDescriptionContainsSearchTerm = inspection.batchDescription.toLowerCase()
        .indexOf(this.searchTerm.toLowerCase()) > -1;
    return riskContainsSearchTerm || addressContainsSearchTerm || batchDescriptionContainsSearchTerm;
  }
}
