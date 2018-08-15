import {Component} from '@angular/core';
import {DateTime, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AddressLocalisationType, FireHydrant, FireHydrantLocationType} from "../../models/fire-hydrant";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UUID} from "angular2-uuid";
import {GenericType} from "../../models/generic-type";
import {FireHydrantRepositoryProvider} from "../../providers/repositories/fire-hydrant-repository-provider";
import {OperatorTypeRepositoryProvider} from "../../providers/repositories/operator-type-repository-provider";
import {LaneRepositoryProvider} from "../../providers/repositories/lane-repository";
import {UnitOfMeasureRepositoryProvider} from "../../providers/repositories/unit-of-measure-repository";
import {UnitOfMeasure} from "../../models/all-construction-types";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
import {ISubscription} from "../../../node_modules/rxjs/Subscription";
import {MapLocalizationRepositoryService} from "../../providers/repositories/map-localisation-repository-service";

@IonicPage()
@Component({
    selector: 'page-fire-hydrant',
    templateUrl: 'fire-hydrant.html',
})
export class FireHydrantPage {

    public fireHydrantLocationType = FireHydrantLocationType;
    public addressLocationType = AddressLocalisationType;
    public fireHydrantLocationTypeKeys = [];
    public addressLocalizationTypeKeys = [];
    public fireHydrant: FireHydrant;
    public form: FormGroup;
    public labels = {};
    public hydrantColors = [];
    public operators = [];
    public fireHydrantTypes: GenericType;
    public inspectionCity = "";
    public pressureMeasuringUnit: UnitOfMeasure[] = [];
    public rateMeasuringUnit: UnitOfMeasure[] = [];
    public selectedIdFireHydrant: string = "";
    public showMap = false;
    public isCanceled = false;

    private subscriber :ISubscription;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private viewCtrl: ViewController,
                private formBuilder: FormBuilder,
                private fireHydrantRepo: FireHydrantRepositoryProvider,
                private operatorsRepo: OperatorTypeRepositoryProvider,
                private laneRepo: LaneRepositoryProvider,
                private unitRepo: UnitOfMeasureRepositoryProvider,
                public laneService: LaneRepositoryProvider,
                private msgTools: MessageToolsProvider,
                private translateService: TranslateService,
                private mapService: MapLocalizationRepositoryService) {

        this.inspectionCity = this.navParams.get("idCity");
        this.selectedIdFireHydrant = this.navParams.get("id");
        this.fireHydrant = new FireHydrant();
        this.subscriber = this.mapService.positionChanged.subscribe((position) => this.updateFireHydrantCoordinates(position));
        this.initiateForm();
    }

    public ionViewDidEnter(){
        this.showMap = false;
        this.isCanceled = false;
    }

    public ngOnInit() {
        this.loadTranslation();
        this.initializeFireHydrantCollections();
    }

    private loadTranslation() {
        this.translateService.get(['confirmation', 'fireHydrantLeaveMessage','localizationServiceDisabled'])
            .subscribe(
                labels => {
                    this.labels = labels;
                }, error => {
                    console.log(error);
                });
    }

    private initializeFireHydrantCollections() {
        this.initializeEnumCollection();
        this.hydrantColors = this.fireHydrantRepo.colors;

        this.loadFireHydrant();
        this.loadFireHydrantTypes();
        this.loadOperators();
        this.loadPressureMeasuringUnit();
        this.loadRateMeasuringUnit();
    }

    private loadFireHydrant() {
        if (this.selectedIdFireHydrant) {
            this.fireHydrantRepo.getFireHydrant(this.selectedIdFireHydrant)
                ._finally(() => {
                    this.initiateForm();
                })
                .subscribe(success => {
                    this.fireHydrant = success;
                }, error => {
                    console.log("Error in getFireHydrant :" + error.message)
                });
        } else {
            this.fireHydrant = new FireHydrant();
            this.initiateForm();
        }
    }

    private loadFireHydrantTypes() {
        this.fireHydrantRepo.getFireHydrantType()
            .subscribe(success => {
                this.fireHydrantTypes = success;
            }, error => {
                console.log("Erreur dans loadFireHydrantTypes " + error);
            })
    }

    private loadOperators() {
        this.operatorsRepo.getOperatorType()
            .subscribe(success => {
                this.operators = success;
            }, error => {
                console.log("Erreur dans loadOperators " + error);
            });
    }

    private initializeEnumCollection() {
        this.fireHydrantLocationTypeKeys = this.fireHydrantRepo.getEnumsKeysCollection(this.fireHydrantLocationType);
        this.addressLocalizationTypeKeys = this.fireHydrantRepo.getEnumsKeysCollection(this.addressLocationType);
    }

    private loadPressureMeasuringUnit() {
        this.unitRepo.getAllForPressure()
            .subscribe(success => {
                this.pressureMeasuringUnit = success;
            }, error => {
                console.log("Erreur dans getAllForPressure " + error);
            })
    }

    private loadRateMeasuringUnit() {
        this.unitRepo.getAllForRate()
            .subscribe(success => {
                this.rateMeasuringUnit = success;
            }, error => {
                console.log("Erreur dans getAllForRate " + error);
            });
    }

    private initiateForm() {
        this.form = this.formBuilder.group({
            id: (this.fireHydrant.id ? this.fireHydrant.id : UUID.UUID()),
            locationType: [this.fireHydrant.locationType ? this.fireHydrant.locationType : FireHydrantLocationType.Address, Validators.required],
            coordinates: [this.fireHydrant.coordinates ? this.fireHydrant.coordinates : null , Validators.required],
            altitude: [this.fireHydrant.altitude ? this.fireHydrant.altitude : 0, Validators.required],
            number: [this.fireHydrant.number ? this.fireHydrant.number : '', Validators.required],
            rateFrom: [this.fireHydrant.rateFrom ? this.fireHydrant.rateFrom : 0, Validators.required],
            rateTo: [this.fireHydrant.rateTo ? this.fireHydrant.rateTo : 0, Validators.required],
            pressureFrom: [this.fireHydrant.pressureFrom ? this.fireHydrant.pressureFrom : 0, Validators.required],
            pressureTo: [this.fireHydrant.pressureTo ? this.fireHydrant.pressureTo : 0, Validators.required],
            color: [this.fireHydrant.color ? this.fireHydrant.color : '#FFFFFF', Validators.required],
            comments: [this.fireHydrant.comments ? this.fireHydrant.comments : ''],
            idCity: [this.fireHydrant.idCity ? this.fireHydrant.idCity : this.inspectionCity, Validators.required],
            idLane: [this.fireHydrant.idLane ? this.fireHydrant.idLane : '', Validators.required],
            idIntersection: [this.fireHydrant.idIntersection ? this.fireHydrant.idIntersection : '', Validators.required],
            idFireHydrantType: [this.fireHydrant.idFireHydrantType ? this.fireHydrant.idFireHydrantType : '', Validators.required],
            idOperatorTypeRate: [this.fireHydrant.idOperatorTypeRate ? this.fireHydrant.idOperatorTypeRate : '', Validators.required],
            idUnitOfMeasureRate: [this.fireHydrant.idUnitOfMeasureRate ? this.fireHydrant.idUnitOfMeasureRate : '', Validators.required],
            idOperatorTypePressure: [this.fireHydrant.idOperatorTypePressure ? this.fireHydrant.idOperatorTypePressure : '', Validators.required],
            idUnitOfMeasurePressure: [this.fireHydrant.idUnitOfMeasurePressure ? this.fireHydrant.idUnitOfMeasurePressure : '', Validators.required],
            physicalPosition: [this.fireHydrant.physicalPosition ? this.fireHydrant.physicalPosition : '', Validators.required],
            civicNumber: [this.fireHydrant.civicNumber ? this.fireHydrant.civicNumber : '', Validators.required],
            addressLocationType: [this.fireHydrant.addressLocationType ? this.fireHydrant.addressLocationType : AddressLocalisationType.NextTo, Validators.required]
        });

        this.refreshLocationTypeValidator();
    }

    public getMapLocalization() {
        this.showMap = true;
        this.navCtrl.push('MapLocalizationPage', {position: this.form.value['coordinates'], getLocation: true});
    }

    private updateFireHydrantCoordinates(position){
        this.form.controls['coordinates'].patchValue(position);
    }

    public prepareColorSelector() {
        setTimeout(() => {
            let buttonElements = document.querySelectorAll('div.alert-radio-group button');
            if (!buttonElements.length) {
                this.prepareColorSelector();
            } else {
                for (let index = 0; index < buttonElements.length; index++) {
                    let buttonElement = buttonElements[index];
                    let optionLabelElement = buttonElement.querySelector('.alert-radio-label');
                    let color = optionLabelElement.innerHTML.trim();

                    if (this.isHexColor(color)) {
                        buttonElement.classList.add('colorselect', 'color_' + color.slice(1, 7));
                        if (color == this.form.value.color) {
                            buttonElement.classList.add('colorselected');
                        }
                    }
                }
            }
        }, 100);
    }

    private isHexColor(color) {
        let hexColorRegEx = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
        return hexColorRegEx.test(color);
    }

    public selectColor(color) {
        let buttonElements = document.querySelectorAll('div.alert-radio-group button.colorselect');
        for (let index = 0; index < buttonElements.length; index++) {
            let buttonElement = buttonElements[index];
            buttonElement.classList.remove('colorselected');
            if (buttonElement.classList.contains('color_' + color.slice(1, 7))) {
                buttonElement.classList.add('colorselected');
            }
        }
    }

    private saveFireHydrant() {
        if (this.form.valid &&(!this.isCanceled)) {
            Object.assign(this.fireHydrant, this.form.value);
            this.fireHydrantRepo.saveFireHydrant(this.fireHydrant)
                .subscribe(
                    success => {
                        this.viewCtrl.dismiss();
                    }, error => {
                        console.log("Erreur dans saveFireHydrant : "+error.message);
                    });
        }
    }

    public ionViewWillLeave() {
        if(!this.showMap) {
            this.saveFireHydrant();
        }
    }

    public async ionViewCanLeave() {
        if (!this.showMap && !this.isCanceled) {
            if (!this.form.valid) {
                if (!await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['fireHydrantLeaveMessage'])) {
                    return false;
                }
            }
        }
    }

    private SetValidators(field: string, enable: boolean){
        if(enable){
            this.form.controls[field].setValidators(Validators.required);
        }else {
            this.form.controls[field].setValidators(null);
        }
        this.form.controls[field].updateValueAndValidity();
    }

    private disableAddressLocationValidators(){
        this.SetValidators('idIntersection', false);
        this.SetValidators('coordinates', false);
        this.SetValidators('physicalPosition', false);
        this.SetValidators('idLane', false);
        this.SetValidators('addressLocationType', false);
        this.SetValidators('civicNumber', false);
    }

    private refreshLocationTypeValidator() {

        this.disableAddressLocationValidators();

        if (this.form.controls['locationType'].value == this.fireHydrantLocationType.Address) {
            this.SetValidators('idLane', true);
            this.SetValidators('addressLocationType', true);
            this.SetValidators('civicNumber', true);
        } else if (this.form.controls['locationType'].value == this.fireHydrantLocationType.LaneAndIntersection) {
            this.SetValidators('idLane', true);
            this.SetValidators('idIntersection', true);
        } else if (this.form.controls['locationType'].value == this.fireHydrantLocationType.Coordinates) {
            this.SetValidators('coordinates', true);
        } else if (this.form.controls['locationType'].value == this.fireHydrantLocationType.Text) {
            this.SetValidators('physicalPosition', true);
        }
    }

    public cancelEdition(){
        this.isCanceled = true;
        this.viewCtrl.dismiss();
    }
}
