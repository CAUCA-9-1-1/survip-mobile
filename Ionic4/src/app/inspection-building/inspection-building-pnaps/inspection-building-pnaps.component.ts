import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { InspectionBuildingPersonRequiringAssistanceForList } from 'src/app/shared/models/inspection-building-person-requiring-assistance-for-list';
import { BuildingPnapDetailComponent } from '../components/building-pnap-detail/building-pnap-detail.component';
import { LoadingController, ModalController } from '@ionic/angular';
import { InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-person-requiring-assistance-type-repository';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inspection-building-pnaps',
  templateUrl: './inspection-building-pnaps.component.html',
  styleUrls: ['./inspection-building-pnaps.component.scss'],
})
export class InspectionBuildingPnapsComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  public pnaps: InspectionBuildingPersonRequiringAssistanceForList[] = [];
  public labels = {};

  constructor(
    private controller: InspectionControllerProvider,
    private load: LoadingController,
    private pnapRepo: InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider,
    private modalCtrl: ModalController,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.translateService.get(['waitFormMessage'])
      .subscribe(
        labels => this.labels = labels,
        error => console.log(error));

    this.loadPnaps();
  }

  private async loadPnaps() {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    await loader.present();
    try {
      const result = await this.pnapRepo.getList(this.controller.currentIdBuilding);
      this.pnaps = result;
    } finally {
      await loader.dismiss();
    }
  }

  public async onItemClick(idBuildingPnap: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BuildingPnapDetailComponent,
      componentProps: {
        idBuildingPnap,
        idBuilding: this.controller.currentIdBuilding
      }
    });
    modal.onDidDismiss().then(() => this.loadPnaps());
    await modal.present();
  }
}
