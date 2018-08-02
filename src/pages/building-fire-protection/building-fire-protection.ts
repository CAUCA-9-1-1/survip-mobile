import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {InspectionBuildingFireProtectionForList} from '../../models/inspection-building-fire-protection-for-list';
import {AuthenticationService} from '../../providers/Base/authentification.service';
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

  sprinklers: InspectionBuildingFireProtectionForList[] = [];
  panels: InspectionBuildingFireProtectionForList[] = [];
  currentSegment: string = "panel";
  labels = {};

  constructor(
    private sprinklerRepo: InspectionBuildingSprinklerRepositoryProvider,
    private panelRepo: InspectionBuildingAlarmPanelRepositoryProvider,
    private load: LoadingController,
    private authService: AuthenticationService,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private translateService : TranslateService) {

    this.idBuilding = navParams.get('idBuilding');
    this.name = navParams.get('name');
  }

    ngOnInit() {
        this.translateService.get([
            'confirmation','waitFormMessage','addFirePanelAlarmButton','addFireSprinklerButton'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

  get entityName(): string{
    return this.currentSegment == 'panel' ? this.labels['addFirePanelAlarmButton'] : this.labels['addFireSprinklerButton'];
  }

  async ionViewDidEnter() {
    await this.loadPanels();
    await this.loadSprinklers();
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(): void{
    this.navCtrl.setRoot('LoginPage');
  }

  private async loadSprinklers() {
    let loader = this.load.create({content: this.labels['waitFormMessage']});
    const result = await this.sprinklerRepo.getList(this.idBuilding);
    this.sprinklers = result;
    await loader.dismiss();
  }

  private async loadPanels() {
    let loader = this.load.create({content: this.labels['waitFormMessage']});
    const result = await this.panelRepo.getList(this.idBuilding);
    this.panels = result;
    await loader.dismiss();
  }

  onPanelClick(idPanel: string): void {
    let modal = this.modalCtrl.create('BuildingAlarmPanelsPage', { idBuildingAlarmPanel: idPanel, idBuilding: this.idBuilding });
    modal.onDidDismiss(() => this.loadPanels());
    modal.present();
  }

  onSprinklerClick(idSprinkler: string): void {
    let modal = this.modalCtrl.create('BuildingWaterSprinklersPage', { idBuildingSprinkler: idSprinkler, idBuilding: this.idBuilding });
    modal.onDidDismiss(() => this.loadSprinklers());
    modal.present();
  }

  onCreateNewRecord() {
    if (this.currentSegment == 'panel')
      this.onPanelClick(null);
    else
      this.onSprinklerClick(null);
  }
}
