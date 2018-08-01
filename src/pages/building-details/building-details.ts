import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AllConstructionTypes, UnitOfMeasure} from '../../models/all-construction-types';
import {ConstructionTypesRepositoryProvider} from '../../providers/repositories/construction-types-repository';
import {UnitOfMeasureRepositoryProvider} from '../../providers/repositories/unit-of-measure-repository';
import {InspectionBuildingDetail} from '../../models/inspection-building-detail';
import {BuildingDetailRepositoryProvider} from '../../providers/repositories/building-detail-repository';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {ISubscription} from 'rxjs/Subscription';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-building-details',
    templateUrl: 'building-details.html',
})
export class BuildingDetailsPage {

    private readonly integerPattern: string = "^(0|([1-9]([0-9]*)))$";
    private readonly decimalPattern: string = "^[0-9]+(.[0-9]{1,2})?$";
    private subscription: ISubscription;

    readonly idBuilding: string;
    readonly name: string;
    allTypes: AllConstructionTypes;
    ratesUnitOfMeasure: UnitOfMeasure[];
    dimensionUnitOfMeasure: UnitOfMeasure[];
    detail: InspectionBuildingDetail;
    form: FormGroup;
    labels = {};

    constructor(
        private formBuilding: FormBuilder,
        private msg: MessageToolsProvider,
        private authService: AuthenticationService,
        private constructionRepo: ConstructionTypesRepositoryProvider,
        private unitOfMeasureRepo: UnitOfMeasureRepositoryProvider,
        private detailRepo: BuildingDetailRepositoryProvider,
        private loadingCtrl: LoadingController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private translateService: TranslateService) {

        this.idBuilding = navParams.get('idBuilding');
        this.name = navParams.get('name');
        this.createForm();
        this.loadDataForLookups();
    }

    ngOnInit() {
        this.translateService.get([
            'buildingLeaveMessage','confirmation','waitFormMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    private loadDataForLookups() {
        this.constructionRepo.getAllTypes()
            .subscribe((types: AllConstructionTypes) => this.allTypes = types);
        this.unitOfMeasureRepo.getAllForDimension()
            .subscribe((units: UnitOfMeasure[]) => this.dimensionUnitOfMeasure = units);
        this.unitOfMeasureRepo.getAllForRate()
            .subscribe((units: UnitOfMeasure[]) => this.ratesUnitOfMeasure = units);
    }

    async ionViewDidEnter() {
        let load = this.loadingCtrl.create({'content': this.labels['waitFormMessage']});
        await load.present();
        this.detail = await this.detailRepo.get(this.idBuilding);
        this.setValuesAndStartListening();
        await load.dismiss();
    }

    async ionViewCanEnter() {
        let isLoggedIn = await this.authService.isStillLoggedIn();
        if (!isLoggedIn)
            this.redirectToLoginPage();
    }

    async ionViewCanLeave() {
        if (this.form.dirty || !this.form.valid)
            return await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['buildingLeaveMessage']);
    }

    private redirectToLoginPage(): void {
        this.navCtrl.setRoot('LoginPage');
    }

    private createForm() {
        let regexChecker = (mask: string) => {
            return (control: FormControl) => {
                var value = control.value + "";
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
            estimatedWaterFlow: [0, [Validators.min(0), Validators.pattern(this.integerPattern)]],
            idUnitOfMeasureEstimatedWaterFlow: [0, [unitOfMeasureFlowValidator]],
            garageType: [0, [Validators.required]],
            idConstructionType: [0],
            idConstructionFireResistanceType: [0],
            idRoofType: [0],
            idRoofMaterialType: [0],
            idBuildingType: [0],
            idBuildingSidingType: [0],
        });
    }

    private setValuesAndStartListening(): void {
        this.setValues();
        this.startWatchingForm();
    }

    private setValues() {
        if (this.detail != null) {
            this.form.patchValue(this.detail);
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
        Object.assign(this.detail, formModel);
        await this.detailRepo.save(this.detail);
        this.form.markAsPristine();
    }
}
