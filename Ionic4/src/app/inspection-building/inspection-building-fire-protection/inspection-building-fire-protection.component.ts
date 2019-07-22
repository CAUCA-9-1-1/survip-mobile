import { Component, OnInit } from '@angular/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { InspectionBuildingFireProtectionForList } from 'src/app/shared/models/inspection-building-fire-protection-for-list';
import { InspectionBuildingAlarmPanelRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-alarm-panel-repository-provider.service';
import { InspectionBuildingSprinklerRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-sprinkler-repository-provider.service';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BuildingWaterSprinklerComponent } from '../components/building-water-sprinkler/building-water-sprinkler.component';
import { BuildingAlarmPanelComponent } from '../components/building-alarm-panel/building-alarm-panel.component';

@Component({
  selector: 'app-inspection-building-fire-protection',
  templateUrl: './inspection-building-fire-protection.component.html',
  styleUrls: ['./inspection-building-fire-protection.component.scss'],
})
export class InspectionBuildingFireProtectionComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  get entityName(): string {
    return this.currentSegment === 'panel' ? this.labels['addFirePanelAlarmButton'] : this.labels['addFireSprinklerButton'];
  }

  public sprinklers: InspectionBuildingFireProtectionForList[] = [];
  public panels: InspectionBuildingFireProtectionForList[] = [];
  public currentSegment: string = 'panel';
  public labels = {};

  constructor(
    private controller: InspectionControllerProvider,
    private sprinklerRepo: InspectionBuildingSprinklerRepositoryProvider,
    private panelRepo: InspectionBuildingAlarmPanelRepositoryProvider,
    private load: LoadingController,
    private modalCtrl: ModalController,
    private translateService: TranslateService
    ) {}

  ngOnInit() {
    this.translateService.get([
      'confirmation', 'waitFormMessage', 'addFirePanelAlarmButton', 'addFireSprinklerButton'
      ]).subscribe(labels => {
          this.labels = labels;
      },
      error => {
          console.log(error);
      });
    if (this.controller.inspectionIsLoaded) {
      this.loadSprinklers();
      this.loadPanels();
    } else {
      this.controller.inspectionLoaded.subscribe(() => {
        this.loadSprinklers();
        this.loadPanels();
      });
    }
  }

  private async loadSprinklers() {
    const loader = await this.load.create({message: this.labels['waitFormMessage']});
    await loader.present();
    try {
      const result = await this.sprinklerRepo.getList(this.controller.currentIdBuilding);
      this.sprinklers = result;
    } finally {
      await loader.dismiss();
    }
  }

  private async loadPanels() {
    const loader = await this.load.create({message: this.labels['waitFormMessage']});
    await loader.present();
    try {
      const result = await this.panelRepo.getList(this.controller.currentIdBuilding);
      this.panels = result;
    } finally {
      await loader.dismiss();
    }
  }

  public async onPanelClick(idPanel: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BuildingAlarmPanelComponent,
      componentProps: {
        idBuildingAlarmPanel: idPanel,
        idBuilding: this.controller.currentIdBuilding
      }
    });

    modal.onDidDismiss().then(() => this.loadPanels());
    await modal.present();
  }

  public async onSprinklerClick(idSprinkler: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: BuildingWaterSprinklerComponent,
      componentProps: {
        idBuildingSprinkler: idSprinkler,
        idBuilding: this.controller.currentIdBuilding
      }
    });

    modal.onDidDismiss().then(() => this.loadSprinklers());
    await modal.present();
  }

  public onCreateNewRecord() {
    if (this.currentSegment === 'panel') {
        this.onPanelClick(null);
    } else {
        this.onSprinklerClick(null);
    }
  }
}
