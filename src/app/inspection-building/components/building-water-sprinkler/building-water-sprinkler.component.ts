import { Component, OnInit } from '@angular/core';
import { InspectionBuildingSprinkler } from 'src/app/shared/models/inspection-building-sprinkler';
import { GenericType } from 'src/app/shared/models/generic-type';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UUID } from 'angular2-UUID';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { SprinklerTypeRepository } from 'src/app/core/services/repositories/sprinkler-type-repository.service';
import { InspectionBuildingSprinklerRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-sprinkler-repository-provider.service';
import { StaticListRepositoryProvider } from 'src/app/core/services/repositories/static-list-repository/static-list-repository';

@Component({
  selector: 'app-building-water-sprinkler',
  templateUrl: './building-water-sprinkler.component.html',
  styleUrls: ['./building-water-sprinkler.component.scss'],
})
export class BuildingWaterSprinklerComponent implements OnInit {

  private idBuildingSprinkler: string;
  private readonly idBuilding: string;

  public isNew: boolean = false;
  public sprinkler: InspectionBuildingSprinkler;
  public types: GenericType[] = [];
  public form: FormGroup;
  public walls: string[] = [];
  public sectors: string[] = [];
  public labels = {};

  constructor(
    private staticRepo: StaticListRepositoryProvider,
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private typeRepo: SprinklerTypeRepository,
    private repo: InspectionBuildingSprinklerRepositoryProvider,
    private msg: MessageToolsProvider,
    private modalController: ModalController,
    private navParams: NavParams,
    private translateService: TranslateService) {
      this.walls = this.staticRepo.getWallList();
      this.sectors = this.staticRepo.getSectorList();
      this.idBuilding = this.navParams.get('idBuilding');
      this.idBuildingSprinkler = this.navParams.get('idBuildingSprinkler');
      this.isNew = this.idBuildingSprinkler == null;
      this.createForm();
    }

  async ngOnInit() {
    this.types = await this.typeRepo.getAll();

    this.translateService.get([
          'confirmation', 'waitFormMessage', 'fireSprinklerLeaveMessage', 'fireSprinklerDeleteQuestion'
      ]).subscribe(
        labels => this.labels = labels,
        error => console.log(error));

    const load = await this.loadCtrl.create({message: this.labels['waitFormMessage']});
    await load.present();
    try {
      if (this.idBuildingSprinkler == null) {
        this.createSprinkler();
      } else {
        this.sprinkler = await this.repo.get(this.idBuilding, this.idBuildingSprinkler);
      }
      this.setValuesAndStartListening();
    } finally {
      await load.dismiss();
    }
  }

  private createForm() {
    this.form = this.fb.group({
        idSprinklerType: ['', [Validators.required]],
        floor: ['', [Validators.maxLength(100)]],
        wall: ['', [Validators.maxLength(100)]],
        sector: ['', [Validators.maxLength(100)]],
        pipeLocation: ['', [Validators.maxLength(500)]],
        collectorLocation: ['', [Validators.maxLength(500)]]
    });
}

private setValuesAndStartListening(): void {
    this.setValues();
    this.startWatchingForm();
}

private setValues() {
    if (this.sprinkler != null) {
        this.form.patchValue(this.sprinkler);
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
    Object.assign(this.sprinkler, formModel);
    await this.repo.save(this.sprinkler);
    this.form.markAsPristine();
    this.isNew = false;
}

private createSprinkler() {
    const data = new InspectionBuildingSprinkler();
    data.id = UUID.UUID();
    data.idBuilding = this.idBuilding;
    data.isActive = true;
    this.idBuildingSprinkler = data.id;
    this.sprinkler = data;
}

public async onDeleteSprinkler() {
    if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['fireSprinklerDeleteQuestion'])) {
        await this.repo.delete(this.sprinkler);
        await this.modalController.dismiss();
    } else if (this.isNew) {
        await this.modalController.dismiss();
    }
}

public async onCancelEdition() {
    if (this.form.dirty || this.isNew) {
        if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['fireSprinklerLeaveMessage'])) {
            await this.modalController.dismiss();
      }
    } else {
          await this.modalController.dismiss();
    }
  }
}
