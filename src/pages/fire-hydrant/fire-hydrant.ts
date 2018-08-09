import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AddressLocalisationType, FireHydrant, FireHydrantLocationType} from "../../models/fire-hydrant";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UUID} from "angular2-uuid";
import {GenericType} from "../../models/generic-type";
import {FireHydrantRepositoryProvider} from "../../providers/repositories/fire-hydrant-repository-provider";
import {OperatorTypeRepositoryProvider} from "../../providers/repositories/operator-type-repository-provider";
import {LaneRepositoryProvider} from "../../providers/repositories/lane-repository";
import {UnitOfMeasureRepositoryProvider} from "../../providers/repositories/unit-of-measure-repository";
import {UnitOfMeasure} from "../../models/all-construction-types";

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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private formBuilder: FormBuilder,
                private fireHydrantRepo: FireHydrantRepositoryProvider,
                private operatorsRepo: OperatorTypeRepositoryProvider,
                private laneRepo: LaneRepositoryProvider,
                private unitRepo: UnitOfMeasureRepositoryProvider,
                public laneService: LaneRepositoryProvider,) {

        this.inspectionCity = this.navParams.get("idCity");
        this.selectedIdFireHydrant = this.navParams.get("id");
        this.fireHydrant = new FireHydrant();
        this.initiateForm();
    }

    ngOnInit(){
        this.initializeFireHydrantCollections();
    }

    private initializeFireHydrantCollections(){
        this.intializeLocationTypeEnum();
        this.intializeAddressLocalizationTypeEnum();
        this.hydrantColors = this.fireHydrantRepo.colors;

        this.loadFireHydrant();
        this.loadFireHydrantTypes();
        this.loadOperators();
        this.LoadMeasuringUnit();
    }

    private loadFireHydrant(){
        if(this.selectedIdFireHydrant){
            this.fireHydrantRepo.getFireHydrant(this.selectedIdFireHydrant)
                ._finally(() =>{this.initiateForm();})
                .subscribe(success => {
                    this.fireHydrant = success;
                }, error => {
                    console.log("Error in getFireHydrant :" + error.message)
                });
        }else {
            this.fireHydrant = new FireHydrant();
            this.initiateForm();
        }
    }

    private loadFireHydrantTypes(){
        this.fireHydrantRepo.getFireHydrantType()
            .subscribe(success=>{
                this.fireHydrantTypes = success;
            }, error =>{
                console.log("Erreur dans loadFireHydrantTypes " + error);
            })
    }

    private loadOperators(){
        this.operatorsRepo.getOperatorType()
            .subscribe(success =>{
                this.operators = success;
            }, error =>{
                console.log("Erreur dans loadOperators " + error);
        });
    }

    private intializeLocationTypeEnum(){
        this.fireHydrantLocationTypeKeys = Object.keys(this.fireHydrantLocationType)
            .map(k => this.fireHydrantLocationType[k])
            .filter(v => typeof v === "number") as number[];
    }

    private intializeAddressLocalizationTypeEnum(){
        this.addressLocalizationTypeKeys = Object.keys(this.addressLocationType)
            .map(k => this.addressLocationType[k])
            .filter(v => typeof v === "number") as number[];
    }

    private LoadMeasuringUnit(){
        this.unitRepo.getAllForRate()
            .subscribe(success => {
                this.rateMeasuringUnit = success;
            }, error => {
                console.log("Erreur dans getAllForRate " + error);
            });

        this.unitRepo.getAllForPressure()
            .subscribe(success => {
                this.pressureMeasuringUnit = success;
            }, error => {
                console.log("Erreur dans getAllForPressure " + error);
            })
    }


    private initiateForm() {
        this.form = this.formBuilder.group({
            id: (this.fireHydrant.id ? this.fireHydrant.id : UUID.UUID()),
            locationType: [this.fireHydrant.locationType ? this.fireHydrant.locationType : FireHydrantLocationType.Address, Validators.required],
            coordinates: [this.fireHydrant.coordinates ? this.fireHydrant.coordinates : []],
            altitude: [this.fireHydrant.altitude ? this.fireHydrant.altitude : 0, Validators.required],
            number: [this.fireHydrant.number ? this.fireHydrant.number : '', Validators.required],
            rateFrom: [this.fireHydrant.rateFrom ? this.fireHydrant.rateFrom : 0, Validators.required],
            rateTo: [this.fireHydrant.rateTo ? this.fireHydrant.rateTo : 0, Validators.required],
            pressureFrom: [this.fireHydrant.pressureFrom ? this.fireHydrant.pressureFrom : 0, Validators.required],
            pressureTo: [this.fireHydrant.pressureTo ? this.fireHydrant.pressureTo : 0, Validators.required],
            color: [this.fireHydrant.color ? this.fireHydrant.color : '#FFFFFF', Validators.required],
            comments: [this.fireHydrant.comments ? this.fireHydrant.comments : ''],
            idCity: [this.fireHydrant.idCity ? this.fireHydrant.idCity : '', Validators.required],
            idLane: [this.fireHydrant.idLane ? this.fireHydrant.idLane : ''],
            idIntersection: [this.fireHydrant.idIntersection ? this.fireHydrant.idIntersection : ''],
            idFireHydrantType: [this.fireHydrant.idFireHydrantType ? this.fireHydrant.idFireHydrantType : '', Validators.required],
            idOperatorTypeRate: [this.fireHydrant.idOperatorTypeRate ? this.fireHydrant.idOperatorTypeRate : '', Validators.required],
            idUnitOfMeasureRate: [this.fireHydrant.idUnitOfMeasureRate ? this.fireHydrant.idUnitOfMeasureRate : '', Validators.required],
            idOperatorTypePressure: [this.fireHydrant.idOperatorTypePressure ? this.fireHydrant.idOperatorTypePressure : '', Validators.required],
            idUnitOfMeasurePressure: [this.fireHydrant.idUnitOfMeasurePressure ? this.fireHydrant.idUnitOfMeasurePressure : '', Validators.required],
            physicalLocation:[this.fireHydrant.physicalLocation ? this.fireHydrant.physicalLocation : ''],
            civicNumber:[this.fireHydrant.civicNumber ? this.fireHydrant.civicNumber : ''],
            addressLocationType:[this.fireHydrant.addressLocationType ? this.fireHydrant.addressLocationType : AddressLocalisationType.NextTo]
        });
    }

    public getMapLocalization(){
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

    public setColor(color) {
        console.log('Selected Color is', color);

    }

}
