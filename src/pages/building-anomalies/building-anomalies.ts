import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {InspectionBuildingAnomalyThemeForList} from '../../models/inspection-building-anomaly-theme-for-list';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InspectionBuildingAnomalyRepositoryProvider} from '../../providers/repositories/inspection-building-anomaly-repository-provider.service';

@IonicPage()
@Component({
  selector: 'page-building-anomalies',
  templateUrl: 'building-anomalies.html',
})
export class BuildingAnomaliesPage {

  private readonly idBuilding: string;
  private readonly name: string;

  public themes: InspectionBuildingAnomalyThemeForList[] = [];

  constructor(
    private load: LoadingController,
    private anomalyRepo: InspectionBuildingAnomalyRepositoryProvider,
    private authService: AuthenticationService,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.idBuilding = navParams.get('idBuilding');
    this.name = navParams.get('name');
  }

  ionViewDidLoad() {
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
    let loader = this.load.create({content: 'Patientez...'});
    const result = await this.anomalyRepo.getList(this.idBuilding);
    this.themes = result;
    await loader.dismiss();
  }

  public onItemClick(idBuildingAnomaly: string): void {
    this.openAnomalyPage(idBuildingAnomaly);
  }

  public onAddAnomalyForTheme(theme: string){
    this.openAnomalyPage(null, theme);
  }

  public onAddNewAnomaly(){
   this.selectThemeThenCreateAnomaly();
  }

  private selectThemeThenCreateAnomaly() {
    let matModal = this.modalCtrl.create('AnomalyThemeSelectionPage');
    matModal.onDidDismiss(data => {
      if (data.hasSelected)
        this.openAnomalyPage(null, data.themeSelected);
    });
    matModal.present();
  }

  private openAnomalyPage(idBuildingAnomaly: string, theme: string = ""){
    let modal = this.modalCtrl.create('BuildingAnomalyDetailPage', { idBuildingAnomaly: idBuildingAnomaly, theme: theme, idBuilding: this.idBuilding });
    modal.onDidDismiss(() => this.loadAnomalies());
    modal.present();
  }
}
