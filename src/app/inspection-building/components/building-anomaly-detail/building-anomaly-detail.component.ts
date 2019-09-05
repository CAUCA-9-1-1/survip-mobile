import { Component, OnInit, OnDestroy } from '@angular/core';
import { InspectionBuildingAnomaly } from 'src/app/shared/models/inspection-building-anomaly';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { InspectionBuildingAnomalyPictureRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-anomaly-picture-repository-provider.service';
import { InspectionBuildingAnomalyRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-anomaly-repository-provider.service';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-UUID';
import { debounceTime } from 'rxjs/operators';
import { AnomalyThemeSelectionComponent } from '../anomaly-theme-selection/anomaly-theme-selection.component';

@Component({
  selector: 'app-building-anomaly-detail',
  templateUrl: './building-anomaly-detail.component.html',
  styleUrls: ['./building-anomaly-detail.component.scss'],
})
export class BuildingAnomalyDetailComponent implements OnInit, OnDestroy {

  private pictureSubscriber: Subscription;
  private readonly idBuilding: string;

  public isNew: boolean = false;
  public anomaly: InspectionBuildingAnomaly = new InspectionBuildingAnomaly();
  public form: FormGroup;
  public labels = {};

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private repo: InspectionBuildingAnomalyRepositoryProvider,
    public picRepo: InspectionBuildingAnomalyPictureRepositoryProvider,
    private msg: MessageToolsProvider,
    private modalController: ModalController,
    public navParams: NavParams,
    private translateService: TranslateService
  ) {
    this.idBuilding = navParams.get('idBuilding');

    this.anomaly = new InspectionBuildingAnomaly();
    this.isNew = navParams.get('idBuildingAnomaly') == null;
    this.anomaly.id = navParams.get('idBuildingAnomaly') ? navParams.get('idBuildingAnomaly') : UUID.UUID();
    this.anomaly.theme = navParams.get('theme');
    this.anomaly.idBuilding = this.idBuilding;
    this.anomaly.isActive = true;
    this.initiateForm();

    this.pictureSubscriber = this.picRepo.picturesChanged.subscribe(() => this.picturesUpdated());
  }

  async ngOnInit() {
    this.translateService.get([
      'waitFormMessage', 'confirmation', 'anomalyDeleteQuestion', 'anomalyLeaveMessage'
    ]).subscribe(
      labels => this.labels = labels,
      error => console.log(error));

    const load = await this.loadCtrl.create({ message: this.labels['waitFormMessage'] });
    await load.present();
    try {
      await this.loadBuildingAnomaly();
    } finally {
      await load.dismiss();
    }
  }

  private async loadBuildingAnomaly() {
    if (!this.isNew) {
      this.anomaly = await this.repo.get(this.idBuilding, this.anomaly.id);
      this.initiateForm();
    }
    this.startWatchingForm();
  }

  private initiateForm() {
    this.form = this.fb.group({
      id: [this.anomaly.id],
      theme: [this.anomaly.theme, [Validators.required, Validators.maxLength(50)]],
      notes: [this.anomaly.notes ? this.anomaly.notes : '', [Validators.required, Validators.maxLength(500)]],
      idBuilding: [this.anomaly.idBuilding]
    });
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
    Object.assign(this.anomaly, this.form.value);
    await this.repo.save(this.anomaly)
      .then(() => {
        this.form.markAsPristine();
        this.isNew = false;
        this.picRepo.save(this.anomaly.id, this.picRepo.pictures);
      })
      .catch(error => {
        console.log('Error in saveForm', error);
      });

  }

  public async onDeleteAnomaly() {
    if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['anomalyDeleteQuestion'])) {
      await this.repo.delete(this.anomaly);
      this.modalController.dismiss();
      this.unSubscribeEvent();
    } else if (this.isNew) {
      this.modalController.dismiss();
      this.unSubscribeEvent();
    }
  }

  public async onCancelEdition() {
    if (this.form.dirty || this.isNew) {
      if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['anomalyLeaveMessage'])) {
        this.modalController.dismiss();
        this.unSubscribeEvent();
      }
    } else {
      this.modalController.dismiss();
      this.unSubscribeEvent();
    }
  }

  public async onSelectAnomaly() {
    const modal = await this.modalCtrl.create({
      component: AnomalyThemeSelectionComponent
    });

    modal.onDidDismiss().then(data => {
      if (data.data.hasSelected) {
        this.form.markAsDirty();
        this.form.controls['theme'].patchValue(data.data.selectedTheme);
      }
    });
    await modal.present();
  }

  private picturesUpdated() {
    this.form.markAsDirty();
    this.form.updateValueAndValidity();
  }

  public unSubscribeEvent() {
    this.pictureSubscriber.unsubscribe();
  }

  public ngOnDestroy() {
    this.unSubscribeEvent();
  }

}
