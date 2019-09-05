import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { BuildingDetailRepositoryProvider } from 'src/app/core/services/repositories/building-detail-repository';
import { ConstructionTypesRepositoryProvider } from 'src/app/core/services/repositories/construction-types-repository';
import { UnitOfMeasureRepositoryProvider } from 'src/app/core/services/repositories/unit-of-measure-repository';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { AllConstructionTypes } from 'src/app/shared/models/all-construction-types';
import { GarageType, InspectionBuildingDetail } from 'src/app/shared/models/inspection-building-detail';
import { InspectionBuildingForList } from 'src/app/shared/models/inspection-building-for-list';
import { UnitOfMeasure } from 'src/app/shared/models/unit-of-measure';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inspection-building-details',
  templateUrl: './inspection-building-details.component.html',
  styleUrls: ['./inspection-building-details.component.scss'],
})
export class InspectionBuildingDetailsComponent implements OnInit {
  private subscription: Subscription;

  public readonly integerPattern: string = '^(0|([1-9]([0-9]*)))$';
  public readonly decimalPattern: string = '^[0-9]+(.[0-9]{1,2})?$';

  public garageTypeKeys = [];
  public get name(): string {
    return this.controller.currentBuildingName;
  }

  public allTypes: AllConstructionTypes;
  public ratesUnitOfMeasure: UnitOfMeasure[];
  public dimensionUnitOfMeasure: UnitOfMeasure[];
  public detail: InspectionBuildingDetail;
  public form: FormGroup;
  public labels = {};
  public garageType = GarageType;

  constructor(
    private formBuilding: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private msg: MessageToolsProvider,
    private constructionRepo: ConstructionTypesRepositoryProvider,
    private unitOfMeasureRepo: UnitOfMeasureRepositoryProvider,
    private detailRepo: BuildingDetailRepositoryProvider,
    private loadingCtrl: LoadingController,
    private controller: InspectionControllerProvider,
    private translateService: TranslateService) {
      this.createForm();
      this.loadBuildingDetail();
  }

  public async ngOnInit() {
    await this.loadDataForLookups();
    this.translateService.get(['buildingLeaveMessage', 'confirmation', 'waitFormMessage'])
      .subscribe(
        labels => {
          this.labels = labels;
        },
        error => {
          console.log(error);
        });
    this.initializeEnumCollection();
  }

  private initializeEnumCollection() {
    this.garageTypeKeys = this.detailRepo.getEnumsKeysCollection(this.garageType);
  }

  private async loadDataForLookups() {
    this.allTypes = await this.constructionRepo.getAllTypes();
    this.dimensionUnitOfMeasure = await this.unitOfMeasureRepo.getAllForDimension();
    this.ratesUnitOfMeasure = await this.unitOfMeasureRepo.getAllForRate();
  }

  public async loadBuildingDetail() {
    const load = await this.loadingCtrl.create({ message: this.labels['waitFormMessage'] });
    try {
      await load.present();
      this.detail = await this.detailRepo.get(this.controller.currentIdBuilding);
      this.setValuesAndStartListening();
    } catch (error) {
      console.log('erreur', error);
    } finally {
      await load.dismiss();
    }
  }

  public async ionViewCanLeave() {

    if (this.form.dirty || !this.form.valid) {
      return await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['buildingLeaveMessage']);
    }
  }

  private createForm() {
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

    const unitOfMeasureHeightValidator = (control: FormControl) => {
      if (this.detail != null && this.detail.height > 0 && (control.value == null || control.value === '')) {
        return { missingUnitOfMeasureHeight: true };
      }
      return null;
    };

    const unitOfMeasureFlowValidator = (control: FormControl) => {
      if (this.detail != null && this.detail.estimatedWaterFlow > 0 && (control.value == null || control.value === '')) {
        return { missingUnitOfMeasureFlow: true };
      }
      return null;
    };

    this.form = this.formBuilding.group({
      height: [0, [Validators.min(0), Validators.max(999999), regexChecker(this.decimalPattern)]],
      idUnitOfMeasureHeight: [0, [unitOfMeasureHeightValidator]],
      estimatedWaterFlow: [0, [Validators.min(0), regexChecker(this.integerPattern)]],
      idUnitOfMeasureEstimatedWaterFlow: [0, [unitOfMeasureFlowValidator]],
      garageType: [0, [Validators.required]],
      idConstructionType: [0],
      idConstructionFireResistanceType: [0],
      idRoofType: [0],
      idRoofMaterialType: [0],
      idBuildingType: [0],
      idBuildingSidingType: [0],
      aliasName: ['', [Validators.maxLength(50)]],
      corporateName: ['', [Validators.maxLength(50)]],
    });
  }

  private setValuesAndStartListening(): void {
    this.setValues();
    this.startWatchingForm();
  }

  private setValues() {
    if (this.detail != null) {
      this.form.patchValue(this.detail);
      const building = this.controller.getBuilding(this.controller.currentIdBuilding);
      this.form.controls['aliasName'].patchValue(building.aliasName);
      this.form.controls['corporateName'].patchValue(building.corporateName);
    }
  }

  private startWatchingForm() {
    this.subscription = this.form.valueChanges
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
    Object.assign(this.detail, formModel);
    const building = this.controller.getBuilding(this.controller.currentIdBuilding);
    building.aliasName = formModel['aliasName'];
    building.corporateName = formModel['corporateName'];
    building.hasBeenModified = true;
    await this.detailRepo.save(this.detail);
    await this.controller.saveBuildings();
    await this.controller.refreshBuildingInformations();
    this.form.markAsPristine();
  }
}

