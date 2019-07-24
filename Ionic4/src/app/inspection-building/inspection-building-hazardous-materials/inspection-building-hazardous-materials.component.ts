import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { InspectionBuildingHazardousMaterialForList } from 'src/app/shared/models/inspection-building-hazardous-material-for-list';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { InspectionBuildingHazardousMaterialRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-hazardous-material-repository';
import { BuildingHazardousMaterialDetailComponent } from '../components/building-hazardous-material-detail/building-hazardous-material-detail.component';

@Component({
  selector: 'app-inspection-building-hazardous-materials',
  templateUrl: './inspection-building-hazardous-materials.component.html',
  styleUrls: ['./inspection-building-hazardous-materials.component.scss'],
})
export class InspectionBuildingHazardousMaterialsComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  public hazardousMaterials: InspectionBuildingHazardousMaterialForList[] = [];
  public labels = {};

  constructor(
    private controller: InspectionControllerProvider,
    private load: LoadingController,
    private matRepo: InspectionBuildingHazardousMaterialRepositoryProvider,
    private modalCtrl: ModalController,
    private translateService: TranslateService
  ) {
  }

  async ngOnInit() {
    this.translateService.get(['waitFormMessage'])
      .subscribe(
        labels => this.labels = labels,
        error => console.log(error));

    await this.loadMaterialList();
  }

  private async loadMaterialList() {
    const loader = await this.load.create({ message: this.labels['waitFormMessage'] });
    try {
      this.hazardousMaterials = await this.matRepo.getList(this.controller.currentIdBuilding);
    } finally {
      await loader.dismiss();
    }
  }

  public async onItemClick(material: InspectionBuildingHazardousMaterialForList): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BuildingHazardousMaterialDetailComponent,
      componentProps: {
        material,
        idBuilding: this.controller.currentIdBuilding
      }
    });
    modal.onDidDismiss().then(() => this.loadMaterialList());
    await modal.present();
  }
}
