import { Component, OnInit } from '@angular/core';
import { GenericType } from 'src/app/shared/models/generic-type';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InspectionBuildingAlarmPanel } from 'src/app/shared/models/inspection-building-alarm-panel';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { AlarmPanelTypeRepository } from 'src/app/core/services/repositories/alarm-panel-type-repository.service';
import { StaticListRepositoryProvider } from 'src/app/core/services/repositories/static-list-repository/static-list-repository';
import { InspectionBuildingAlarmPanelRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-alarm-panel-repository-provider.service';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-UUID';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-building-alarm-panel',
  templateUrl: './building-alarm-panel.component.html',
  styleUrls: ['./building-alarm-panel.component.scss'],
})
export class BuildingAlarmPanelComponent implements OnInit {

  private idBuildingAlarmPanel: string;
    private readonly idBuilding: string;

    public isNew: boolean = false;
    public panel: InspectionBuildingAlarmPanel;
    public types: GenericType[] = [];
    public form: FormGroup;
    public walls: string[] = [];
    public sectors: string[] = [];
    public labels = {};

  constructor(
    private typeRepo: AlarmPanelTypeRepository,
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private staticRepo: StaticListRepositoryProvider,
    private repo: InspectionBuildingAlarmPanelRepositoryProvider,
    private msg: MessageToolsProvider,
    private modalController: ModalController,
    private navParams: NavParams,
    private translateService: TranslateService) {
      this.walls = this.staticRepo.getWallList();
      this.sectors = this.staticRepo.getSectorList();
      this.idBuilding = this.navParams.get('idBuilding');
      this.idBuildingAlarmPanel = this.navParams.get('idBuildingAlarmPanel');
      this.isNew = this.idBuildingAlarmPanel == null;
      this.createForm();
    }

  async ngOnInit() {
    this.types = await this.typeRepo.getAll();

    this.translateService.get([
        'confirmation', 'waitFormMessage', 'fireAlarmPanelDeleteQuestion', 'fireAlarmPanelLeaveMessage'
      ]).subscribe(
        labels => this.labels = labels,
        error => console.log(error));

    const load = await this.loadCtrl.create({message: this.labels['waitFormMessage']});
    await load.present();
    try {
      if (this.idBuildingAlarmPanel == null) {
        this.createAlarmPanel();
      } else {
        this.panel = await this.repo.get(this.idBuilding, this.idBuildingAlarmPanel);
      }
      this.setValuesAndStartListening();
    } finally {
      await load.dismiss();
    }
  }

  private createForm() {
    this.form = this.fb.group({
      idAlarmPanelType: ['', [Validators.required]],
      floor: ['', [Validators.maxLength(100)]],
      wall: ['', [Validators.maxLength(100)]],
      sector: ['', [Validators.maxLength(100)]]
  });
  }

private setValuesAndStartListening(): void {
  this.setValues();
  this.startWatchingForm();
}

private setValues() {
  if (this.panel != null) {
    this.form.patchValue(this.panel);
  }
}

private startWatchingForm() {
  this.form.valueChanges
    .pipe(debounceTime(500))
    .subscribe(() => this.saveIfValid());
}

private saveIfValid() {
  if (this.form.valid && this.form.dirty) {
    this.saveForm();
  }
}

private async saveForm() {
  const formModel = this.form.value;
  Object.assign(this.panel, formModel);
  await this.repo.save(this.panel);
  this.form.markAsPristine();
  this.isNew = false;
}

private createAlarmPanel() {
  const data = new InspectionBuildingAlarmPanel();
  data.id = UUID.UUID();
  data.idBuilding = this.idBuilding;
  data.isActive = true;
  this.idBuildingAlarmPanel = data.id;
  this.panel = data;
}

public async onDeleteAlarmPanel() {
  if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['fireAlarmPanelDeleteQuestion'])) {
    await this.repo.delete(this.panel);
    await this.modalController.dismiss();
  } else if (this.isNew) {
    await this.modalController.dismiss();
  }
}

  public async onCancelEdition() {
    if (this.form.dirty || this.isNew) {
      if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['fireAlarmPanelLeaveMessage'])) {
        await this.modalController.dismiss();
      }
    } else {
      await this.modalController.dismiss();
    }
  }
}
