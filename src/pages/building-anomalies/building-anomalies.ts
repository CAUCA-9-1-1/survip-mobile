import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {InspectionBuildingAnomalyThemeForList} from '../../models/inspection-building-anomaly-theme-for-list';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InspectionBuildingAnomalyRepositoryProvider} from '../../providers/repositories/inspection-building-anomaly-repository-provider.service';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-building-anomalies',
  templateUrl: 'building-anomalies.html',
})
export class BuildingAnomaliesPage {

  private readonly idBuilding: string;
  private readonly name: string;

  themes: InspectionBuildingAnomalyThemeForList[] = [];
  labels = {};

  constructor(
    private load: LoadingController,
    private anomalyRepo: InspectionBuildingAnomalyRepositoryProvider,
    private authService: AuthenticationService,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private translateService: TranslateService) {

    this.idBuilding = navParams.get('idBuilding');
    this.name = navParams.get('name');
  }

    ngOnInit() {
        this.translateService.get([
            'waitFormMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

  async ionViewDidEnter() {
    await this.loadAnomalies();
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(): void{
    this.navCtrl.setRoot('LoginPage');
  }

  private async loadAnomalies() {
    let loader = this.load.create({content: this.labels['waitFormMessage']});
    const result = await this.anomalyRepo.getList(this.idBuilding);
    this.themes = result;
    await loader.dismiss();
  }

  onItemClick(idBuildingAnomaly: string): void {
    this.openAnomalyPage(idBuildingAnomaly);
  }

  onAddAnomalyForTheme(theme: string){
    this.openAnomalyPage(null, theme);
  }

  onAddNewAnomaly(){
   this.selectThemeThenCreateAnomaly();
  }

  private selectThemeThenCreateAnomaly() {
    let matModal = this.modalCtrl.create('AnomalyThemeSelectionPage');
    matModal.onDidDismiss(data => {
      if (data.hasSelected)
        this.openAnomalyPage(null, data.selectedTheme);
    });
    matModal.present();
  }

  private openAnomalyPage(idBuildingAnomaly: string, theme: string = ""){
    let modal = this.modalCtrl.create('BuildingAnomalyDetailPage', { idBuildingAnomaly: idBuildingAnomaly, theme: theme, idBuilding: this.idBuilding });
    modal.onDidDismiss(() => this.loadAnomalies());
    modal.present();
  }
}
