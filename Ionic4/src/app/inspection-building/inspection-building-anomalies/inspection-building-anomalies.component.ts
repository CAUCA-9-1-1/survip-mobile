import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { InspectionBuildingAnomalyThemeForList } from 'src/app/shared/models/inspection-building-anomaly-theme-for-list';
import { InspectionBuildingAnomalyRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-anomaly-repository-provider.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AnomalyThemeSelectionComponent } from '../components/anomaly-theme-selection/anomaly-theme-selection.component';
import { BuildingAnomalyDetailComponent } from '../components/building-anomaly-detail/building-anomaly-detail.component';

@Component({
  selector: 'app-inspection-building-anomalies',
  templateUrl: './inspection-building-anomalies.component.html',
  styleUrls: ['./inspection-building-anomalies.component.scss'],
})
export class InspectionBuildingAnomaliesComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  public themes: InspectionBuildingAnomalyThemeForList[] = [];
  public labels = {};

  constructor(
    private controller: InspectionControllerProvider,
    private load: LoadingController,
    private anomalyRepo: InspectionBuildingAnomalyRepositoryProvider,
    private modalCtrl: ModalController,
    private translateService: TranslateService) { }

  async ngOnInit() {
    this.translateService.get(['waitFormMessage'])
      .subscribe(labels => this.labels = labels, error => console.log(error));
    await this.loadAnomalies();
  }

  private async loadAnomalies() {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    try {
      const result = await this.anomalyRepo.getList(this.controller.currentIdBuilding);
      this.themes = result;
    } finally {
      await loader.dismiss();
    }
  }

  public onItemClick(idBuildingAnomaly: string): void {
    this.openAnomalyPage(idBuildingAnomaly);
  }

  public onAddAnomalyForTheme(theme: string) {
    this.openAnomalyPage(null, theme);
  }

  public onAddNewAnomaly() {
    this.selectThemeThenCreateAnomaly();
  }

  private async selectThemeThenCreateAnomaly() {
    const matModal = await this.modalCtrl.create({ component: AnomalyThemeSelectionComponent });
    matModal.onDidDismiss().then(retValue => {
      const data = retValue.data;
      if (data.hasSelected) {
        this.openAnomalyPage(null, data.selectedTheme);
      }
    });
    matModal.present();
  }

  private async openAnomalyPage(idBuildingAnomaly: string, theme: string = '') {
    const modal = await this.modalCtrl.create({
      component: BuildingAnomalyDetailComponent,
      componentProps: {
        idBuildingAnomaly,
        theme,
        idBuilding: this.controller.currentIdBuilding
      }
    });
    modal.onDidDismiss().then(() => this.loadAnomalies());
    modal.present();
  }
}
