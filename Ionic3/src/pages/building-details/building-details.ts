import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AllConstructionTypes} from '../../models/all-construction-types';
import {ConstructionTypesRepositoryProvider} from '../../providers/repositories/construction-types-repository';
import {UnitOfMeasureRepositoryProvider} from '../../providers/repositories/unit-of-measure-repository';
import {GarageType, InspectionBuildingDetail} from '../../models/inspection-building-detail';
import {BuildingDetailRepositoryProvider} from '../../providers/repositories/building-detail-repository';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {ISubscription} from 'rxjs/Subscription';
import {TranslateService} from "@ngx-translate/core";
import {UnitOfMeasure} from "../../models/unit-of-measure";
import {InspectionBuildingForList} from "../../models/inspection-building-for-list";
import {InspectionControllerProvider} from "../../providers/inspection-controller/inspection-controller";

@IonicPage()
@Component({
    selector: 'page-building-details',
    templateUrl: 'building-details.html',
})
export class BuildingDetailsPage {

    private readonly integerPattern: string = "^(0|([1-9]([0-9]*)))$";
    private readonly decimalPattern: string = "^[0-9]+(.[0-9]{1,2})?$";
    private subscription: ISubscription;

    public garageTypeKeys = [];
    public readonly idBuilding: string;
    public readonly name: string;

    public allTypes: AllConstructionTypes;
    public ratesUnitOfMeasure: UnitOfMeasure[];
    public dimensionUnitOfMeasure: UnitOfMeasure[];
    public detail: InspectionBuildingDetail;
    public building: InspectionBuildingForList;
    public form: FormGroup;
    public labels = {};
    public garageType = GarageType;

    constructor(
        private formBuilding: FormBuilder,
        private msg: MessageToolsProvider,
        private constructionRepo: ConstructionTypesRepositoryProvider,
        private unitOfMeasureRepo: UnitOfMeasureRepositoryProvider,
        private detailRepo: BuildingDetailRepositoryProvider,
        private loadingCtrl: LoadingController,
        private controller: InspectionControllerProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        private translateService: TranslateService) {

        this.idBuilding = navParams.get('idBuilding');
        this.name = navParams.get('name');
        this.createForm();
        this.building = this.controller.inspection.buildings.find(b => b.idBuilding == this.idBuilding);
    }

    public async ngOnInit() {
        await this.loadDataForLookups();
        this.translateService.get([
            'buildingLeaveMessage', 'confirmation', 'waitFormMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
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

    public async ionViewDidEnter() {
        let load = this.loadingCtrl.create({'content': this.labels['waitFormMessage']});
        try {
          await load.present();
          this.detail = await this.detailRepo.get(this.idBuilding);
          this.setValuesAndStartListening();
        }
        catch(error) {
          console.log('erreur', error);
        }
        finally {
          await load.dismiss();
        }
    }

    public async ionViewCanLeave() {
        if (this.form.dirty || !this.form.valid)
            return await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['buildingLeaveMessage']);
    }

    private createForm() {
        let regexChecker = (mask: string) => {
            return (control: FormControl) => {
                const value = control.value + "";
                const reg = new RegExp(mask);
                if (reg.test(value))
                    return null;
                else
                    return {'incorrectValue': true};
            };
        };

        let unitOfMeasureHeightValidator = (control: FormControl) => {
            if (this.detail != null && this.detail.height > 0 && (control.value == null || control.value == ""))
                return {'missingUnitOfMeasureHeight': true};
            return null;
        };

        let unitOfMeasureFlowValidator = (control: FormControl) => {
            if (this.detail != null && this.detail.estimatedWaterFlow > 0 && (control.value == null || control.value == ""))
                return {'missingUnitOfMeasureFlow': true};
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
            this.form.controls['aliasName'].patchValue(this.building.aliasName);
            this.form.controls['corporateName'].patchValue(this.building.corporateName);
        }
    }

    private startWatchingForm() {
        this.subscription = this.form.valueChanges
            .debounceTime(500)
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
        this.building.aliasName = formModel['aliasName'];
        this.building.corporateName = formModel['corporateName'];
        this.building.hasBeenModified = true;
        await this.detailRepo.save(this.detail);
        await this.controller.saveBuildings();
        await this.controller.refreshBuildingInformations();
        this.form.markAsPristine();
    }
}