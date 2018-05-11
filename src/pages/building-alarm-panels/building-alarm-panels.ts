import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';
import {InspectionBuildingAlarmPanel} from '../../models/inspection-building-alarm-panel';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {InspectionBuildingAlarmPanelRepositoryProvider} from '../../providers/repositories/inspection-building-alarm-panel-repository-provider.service';
import {UUID} from 'angular2-uuid';
import {StaticListRepositoryProvider} from '../../providers/static-list-repository/static-list-repository';
import {GenericType} from '../../models/generic-type';
import {AlarmPanelTypeRepository} from '../../providers/repositories/alarm-panel-type-repository.service';

@IonicPage()
@Component({
  selector: 'page-building-alarm-panels',
  templateUrl: 'building-alarm-panels.html',
})
export class BuildingAlarmPanelsPage {

  private isNew: boolean = false;
  private idBuildingAlarmPanel: string;
  private readonly idBuilding: string;
  private subscription: ISubscription;

  public panel: InspectionBuildingAlarmPanel;
  public types: GenericType[] = [];
  public form: FormGroup;
  public walls: string[] = [];
  public sectors: string[] = [];

  constructor(
    private typeRepo: AlarmPanelTypeRepository,
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private staticRepo: StaticListRepositoryProvider,
    private repo: InspectionBuildingAlarmPanelRepositoryProvider,
    private msg: MessageToolsProvider,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

    typeRepo.getAll()
      .subscribe(data => this.types = data);
    this.walls = staticRepo.getWallList();
    this.sectors = staticRepo.getSectorList();
    this.idBuilding = navParams.get("idBuilding");
    this.idBuildingAlarmPanel = navParams.get('idBuildingAlarmPanel');
    this.createForm();
  }

  ionViewDidLoad() {
  }

  async ionViewDidEnter(){
    let load = this.loadCtrl.create({'content': 'Patientez...'});
    await load.present();
    if (this.idBuildingAlarmPanel == null){
      this.createAlarmPanel();
    }
    else {
      const data = await this.repo.get(this.idBuildingAlarmPanel);
      this.panel = data;
    }
    this.setValuesAndStartListening();
    await load.dismiss();
  }

  private createForm() {
    this.form = this.fb.group({
      idAlarmPanelType: ['', [Validators.required]],
      floor: ['', [Validators.maxLength(100)]],
      wall: ['', [Validators.maxLength(100)]],
      sector: ['', [Validators.maxLength(100)]]
    });
  }

  private setValuesAndStartListening(): void{
    this.setValues();
    this.startWatchingForm();
  }

  private setValues() {
    if (this.panel != null) {
      this.form.patchValue(this.panel);
    }
  }

  private startWatchingForm() {
    this.subscription = this.form.valueChanges
      .debounceTime(500)
      .subscribe(() => this.saveIfValid());
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty)
      this.saveForm();
  }

  private async saveForm() {
    const formModel = this.form.value;
    Object.assign(this.panel, formModel);
    await this.repo.save(this.panel);
    this.form.markAsPristine();
    this.isNew = false;
  }

  private createAlarmPanel() {
    this.isNew = true;
    let data =  new InspectionBuildingAlarmPanel();
    data.id = UUID.UUID();
    data.idBuilding = this.idBuilding;
    this.idBuildingAlarmPanel = data.id;
    this.panel = data;
  }

  public async onDeleteAlarmPanel() {
    if (!this.isNew && await this.msg.ShowMessageBox("Confirmation de suppression", "Êtes-vous certain de vouloir supprimer ce panneau d'alarme?")) {
      await this.repo.delete(this.idBuildingAlarmPanel);
      this.viewCtrl.dismiss();
    }
    else if (this.isNew) {
      this.viewCtrl.dismiss();
    }
  }

  public async onCancelEdition() {
    if (this.form.dirty || this.isNew) {
      if (await this.msg.ShowMessageBox("Confirmation", "Le panneaux d'alarme contient des erreurs de validation et n'a pas été sauvegardé.  Voulez-vous quand même retourner à la page des panneaux d'alarmes du bâtiment?"))
        this.viewCtrl.dismiss();
    }
    else
      this.viewCtrl.dismiss();
  }
}
