import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UUID } from 'angular2-UUID';
import { InspectionBuildingHazardousMaterial, TankType } from 'src/app/shared/models/inspection-building-hazardous-material';
import { debounceTime } from 'rxjs/operators';
import { UnitOfMeasure } from 'src/app/shared/models/unit-of-measure';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { StaticListRepositoryProvider } from 'src/app/core/services/repositories/static-list-repository/static-list-repository';
import { InspectionBuildingHazardousMaterialRepositoryProvider } from 'src/app/core/services/repositories/inspection-building-hazardous-material-repository';
import { HazardousMaterialRepositoryProvider } from 'src/app/core/services/repositories/hazardous-material-repository';
import { UnitOfMeasureRepositoryProvider } from 'src/app/core/services/repositories/unit-of-measure-repository';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { TranslateService } from '@ngx-translate/core';
import { HazardousMaterialSelectionComponent } from '../hazardous-material-selection/hazardous-material-selection.component';

@Component({
  selector: 'app-building-hazardous-material-detail',
  templateUrl: './building-hazardous-material-detail.component.html',
  styleUrls: ['./building-hazardous-material-detail.component.scss'],
})
export class BuildingHazardousMaterialDetailComponent implements OnInit {

  private idBuildingHazardousMaterial: string;
  private readonly idBuilding: string;
  public readonly integerPattern: string = '^(0|([1-9]([0-9]*)))$';
  public readonly decimalPattern: string = '^[0-9]+(.[0-9]{1,2})?$';

  public tankTypeKeys = [];
  public isNew: boolean = false;
  public selectedMaterialDescription: string = '';
  public material: InspectionBuildingHazardousMaterial;
  public form: FormGroup;
  public unitOfMeasures: UnitOfMeasure[] = [];
  public walls: string[] = [];
  public sectors: string[] = [];
  public labels = {};
  public tankType = TankType;

  constructor(
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private staticRepo: StaticListRepositoryProvider,
    private repo: InspectionBuildingHazardousMaterialRepositoryProvider,
    private unitRepo: UnitOfMeasureRepositoryProvider,
    private msg: MessageToolsProvider,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private translateService: TranslateService) {
      
    this.idBuilding = this.navParams.get('idBuilding');
    const material = this.navParams.get('material');
    if (material != null) {
      this.idBuildingHazardousMaterial = material.id;
      this.selectedMaterialDescription = material.hazardousMaterialName + ' (' + material.hazardousMaterialNumber + ')';
    } else {
      this.selectedMaterialDescription = '';
    }

    this.isNew = this.idBuildingHazardousMaterial == null;
    this.walls = this.staticRepo.getWallList();
    this.sectors = this.staticRepo.getSectorList();
    this.createForm();
  }

  async ngOnInit() {
    this.unitOfMeasures = await this.unitRepo.getAllForCapacity();
    this.translateService.get([
      'confirmation', 'waitFormMessage', 'hazardousMaterialDeleteQuestion', 'hazardousMaterialLeaveMessage'
    ]).subscribe(
      labels => this.labels = labels,
      error => console.log(error));
    this.initializeEnumCollection();

    const load = await this.loadCtrl.create({ message: this.labels['waitFormMessage'] });
    await load.present();
    try {
      if (this.idBuildingHazardousMaterial == null) {
        this.createBuildingHazardousMaterial();
      } else {
        this.material = await this.repo.get(this.idBuilding, this.idBuildingHazardousMaterial);
      }

      this.setValuesAndStartListening();
    } finally {
      await load.dismiss();
    }
  }

  private initializeEnumCollection() {
    this.tankTypeKeys = this.repo.getEnumsKeysCollection(this.tankType);
  }

  private createForm() {
    const unitOfMeasureValidator = (control: FormControl) => {
      if (this.material != null && this.form.value['capacityContainerMasked'] > 0 && (control.value == null || control.value === '')) {
        return { missingUnitOfMeasure: true };
      }
      return null;
    };

    const regexChecker = (mask: string) => {
      return (control: FormControl) => {
        const value = control.value + '';
        const reg = new RegExp(mask);
        if (reg.test(value)) {
          return null;
        } else {
          return { incorrectValue: true };
        }
      };
    };

    this.form = this.fb.group({
      idHazardousMaterial: ['', [Validators.required]],
      quantityMasked: [0, [Validators.required, Validators.min(0), Validators.max(999999), regexChecker(this.integerPattern)]],
      idUnitOfMeasure: ['', [unitOfMeasureValidator]],
      container: ['', Validators.maxLength(100)],
      capacityContainerMasked: [0, [Validators.min(0), Validators.required, Validators.max(99999), regexChecker(this.decimalPattern)]],
      tankTypeMasked: [0, Validators.required],
      supplyLine: ['', [Validators.maxLength(50)]],
      place: ['', [Validators.maxLength(200)]],
      wall: ['', Validators.maxLength(15)],
      sector: ['', Validators.maxLength(15)],
      floor: ['', Validators.maxLength(4)],
      gasInlet: ['', Validators.maxLength(100)],
      securityPerimeter: ['', Validators.maxLength(500)],
      otherInformation: ['', Validators.maxLength(500)]
    });
  }

  private setValuesAndStartListening(): void {
    this.setValues();
    this.startWatchingForm();
  }

  private setValues() {
    if (this.material != null) {
      this.form.patchValue(this.material);
      this.form.controls['quantityMasked'].patchValue(this.material.quantity, { emitEvent: false });
      this.form.controls['capacityContainerMasked'].patchValue(this.material.capacityContainer, { emitEvent: false });
      this.form.controls['tankTypeMasked'].patchValue(this.material.tankType, { emitEvent: false });
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

  public getAllErrors(form: FormGroup): { [key: string]: any; } | null {
    let hasError = false;
    const result = Object.keys(form.controls).reduce((acc, key) => {
      const control = form.get(key);
      const errors = (control instanceof FormGroup)
        ? this.getAllErrors(control)
        : control.errors;
      if (errors) {
        acc[key] = errors;
        hasError = true;
      }
      return acc;
    }, {} as { [key: string]: any; });
    return hasError ? result : null;
  }

  private async saveForm() {
    Object.assign(this.material, this.form.value);
    this.material.quantity = parseInt(this.form.value.quantityMasked, 10);
    this.material.capacityContainer = parseFloat(this.form.value.capacityContainerMasked);
    this.material.tankType = parseInt(this.form.value.tankTypeMasked, 10);
    await this.repo.save(this.material);
    this.form.markAsPristine();
    this.isNew = false;
  }

  private createBuildingHazardousMaterial() {
    const data = new InspectionBuildingHazardousMaterial();
    data.id = UUID.UUID();
    data.tankType = 0;
    data.quantity = 0;
    data.capacityContainer = 0;
    data.idBuilding = this.idBuilding;
    data.isActive = true;
    this.idBuildingHazardousMaterial = data.id;
    this.material = data;
  }

  public async onDeleteHazardousMaterial() {
    if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['hazardousMaterialDeleteQuestion'])) {
      await this.repo.delete(this.material);
      await this.modalCtrl.dismiss();
    } else if (this.isNew) {
      await this.modalCtrl.dismiss();
    }
  }

  public async onChangeMaterial() {
    const matModal = await this.modalCtrl.create({
      component: HazardousMaterialSelectionComponent
    });

    matModal.onDidDismiss().then(retValue => {
      const data = retValue.data;
      if (data.hasSelected) {
        this.form.markAsDirty();
        this.form.controls['idHazardousMaterial'].setValue(data.selectedMaterial.id);
        this.selectedMaterialDescription = data.selectedMaterial.name + ' (' + data.selectedMaterial.number + ')';
        this.material.idHazardousMaterial = data.selectedMaterial.id;
        this.saveIfValid();
      }
    });
    matModal.present();
  }

  public async onCancelEdition() {
    if (this.form.dirty || this.isNew) {
      if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['hazardousMaterialLeaveMessage'])) {
        await this.modalCtrl.dismiss();
      }
    } else {
      await this.modalCtrl.dismiss();
    }
  }

  public onCapacityChanged() {
    if (!this.material.idUnitOfMeasure) {
      this.form.controls['idUnitOfMeasure'].reset();
    }
  }
}

