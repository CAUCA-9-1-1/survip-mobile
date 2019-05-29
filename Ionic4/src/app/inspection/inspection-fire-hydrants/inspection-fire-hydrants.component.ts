import { Component, OnInit } from '@angular/core';
import { InspectionBuildingFireHydrantForList } from 'src/app/shared/models/inspection-building-fire-hydrant-for-list';
import { Inspection } from 'src/app/shared/interfaces/inspection.interface';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { InspectionBuildingFireHydrantRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-fire-hydrant-repository-provider';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from '@ionic/angular';
import { CityFireHydrantsComponent } from '../components/city-fire-hydrants/city-fire-hydrants.component';

@Component({
  selector: 'app-inspection-fire-hydrants',
  templateUrl: './inspection-fire-hydrants.component.html',
  styleUrls: ['./inspection-fire-hydrants.component.scss'],
})
export class InspectionFireHydrantsComponent implements OnInit {

  public labels = {};
  public fireHydrants: InspectionBuildingFireHydrantForList[] = [];

  public get currentInspection(): Inspection {
    return this.controller.currentInspection;
  }

  constructor(
    private controller: InspectionControllerProvider,
    private modalController: ModalController,
    private hydrantRepo: InspectionBuildingFireHydrantRepositoryProvider,
    private messageTools: MessageToolsProvider,
    private translateService: TranslateService
  ) {
    if (controller.inspectionIsLoaded) {
      this.loadBuildingFireHydrant();
    } else {
      controller.inspectionLoaded.subscribe(() => this.loadBuildingFireHydrant());
    }
  }

  ngOnInit() {
    this.translateService.get([
      'fireHydrantDelete', 'fireHydrantDeleteQuestion'
    ]).subscribe(labels => {
            this.labels = labels;
        },
        error => {
            console.log(error);
        });
  }

  private loadBuildingFireHydrant() {
    this.hydrantRepo.getList(this.controller.getMainBuilding().idBuilding)
      .then(hydrants => this.fireHydrants = hydrants);
  }

  public async onDeleteFireHydrant(idFireHydrant: string) {
      const canDelete = await this.messageTools.ShowMessageBox(this.labels['fireHydrantDelete'], this.labels['fireHydrantDeleteQuestion']);
      if (canDelete) {
          await this.hydrantRepo.deleteFireHydrant(this.controller.getMainBuilding().idBuilding, idFireHydrant);
          this.loadBuildingFireHydrant();
      }
  }

  public async onItemClick(idCity: string) {
    const modal = await this.modalController.create({
      component: CityFireHydrantsComponent,
      componentProps: {
        idCity,
        idBuilding: this.controller.getMainBuilding().idBuilding
      }
    });
    await modal.present();
  }
}
