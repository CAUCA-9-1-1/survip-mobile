import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {InspectionBuildingFireProtectionForList} from '../../models/inspection-building-fire-protection-for-list';
import {InspectionBuildingSprinklerRepositoryProvider} from '../../providers/repositories/inspection-building-sprinkler-repository-provider.service';
import {InspectionBuildingAlarmPanelRepositoryProvider} from '../../providers/repositories/inspection-building-alarm-panel-repository-provider.service';
import {TranslateService} from "@ngx-translate/core";


@IonicPage()
@Component({
    selector: 'page-building-fire-protection',
    templateUrl: 'building-fire-protection.html',
})
export class BuildingFireProtectionPage {

    private readonly idBuilding: string;
    private readonly name: string;

    public sprinklers: InspectionBuildingFireProtectionForList[] = [];
    public panels: InspectionBuildingFireProtectionForList[] = [];
    public currentSegment: string = "panel";
    public labels = {};

    constructor(
        private sprinklerRepo: InspectionBuildingSprinklerRepositoryProvider,
        private panelRepo: InspectionBuildingAlarmPanelRepositoryProvider,
        private load: LoadingController,
        private modalCtrl: ModalController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private translateService: TranslateService) {

        this.idBuilding = navParams.get('idBuilding');
        this.name = navParams.get('name');
    }

    public ngOnInit() {
        this.translateService.get([
            'confirmation', 'waitFormMessage', 'addFirePanelAlarmButton', 'addFireSprinklerButton'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    get entityName(): string {
        return this.currentSegment == 'panel' ? this.labels['addFirePanelAlarmButton'] : this.labels['addFireSprinklerButton'];
    }

    public async ionViewDidEnter() {
        await this.loadPanels();
        await this.loadSprinklers();
    }

    private async loadSprinklers() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        await loader.present();
        try {
          const result = await this.sprinklerRepo.getList(this.idBuilding);
          this.sprinklers = result;
        } finally {
          await loader.dismiss();
        }
    }

    private async loadPanels() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        try {
          const result = await this.panelRepo.getList(this.idBuilding);
          this.panels = result;
        } finally {
          await loader.dismiss();
        }
    }

    public onPanelClick(idPanel: string): void {
        let modal = this.modalCtrl.create('BuildingAlarmPanelsPage', {
            idBuildingAlarmPanel: idPanel,
            idBuilding: this.idBuilding
        });
        modal.onDidDismiss(() => this.loadPanels());
        modal.present();
    }

    public onSprinklerClick(idSprinkler: string): void {
        let modal = this.modalCtrl.create('BuildingWaterSprinklersPage', {
            idBuildingSprinkler: idSprinkler,
            idBuilding: this.idBuilding
        });
        modal.onDidDismiss(() => this.loadSprinklers());
        modal.present();
    }

    public onCreateNewRecord() {
        if (this.currentSegment == 'panel')
            this.onPanelClick(null);
        else
            this.onSprinklerClick(null);
    }
}
