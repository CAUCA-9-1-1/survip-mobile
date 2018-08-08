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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private formBuilder: FormBuilder,
                private fireHydrantRepo: FireHydrantRepositoryProvider,
                private operatorsRepo: OperatorTypeRepositoryProvider,
                private laneRepo: LaneRepositoryProvider,
                private unitRepo: UnitOfMeasureRepositoryProvider,
                public laneService: LaneRepositoryProvider,) {

        this.inspectionCity = this.navParams.get("idCity");
        this.fireHydrant = new FireHydrant();
    }

    ngOnInit(){
        this.initializeFireHydrantCollections();
        this.initiateForm();
    }

    private initializeFireHydrantCollections(){
        this.intializeLocationTypeEnum();
        this.intializeAddressLocalizationTypeEnum();
        this.hydrantColors = this.fireHydrantRepo.colors;
        this.loadFireHydrantTypes();
        this.loadOperators();
        this.LoadMeasuringUnit();
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
            id: UUID.UUID(),
            locationType: [0, Validators.required],
            coordinates: [''],
            altitude: [0, Validators.required],
            number: ['', Validators.required],
            rateFrom: [0, Validators.required],
            rateTo: [0, Validators.required],
            pressureFrom: [0, Validators.required],
            pressureTo: [0, Validators.required],
            color: ['', Validators.required],
            comments: [''],
            idCity: ['', Validators.required],
            idLane: [''],
            idIntersection: [''],
            idFireHydrantType: ['', Validators.required],
            idOperatorTypeRate: ['', Validators.required],
            idUnitOfMeasureRate: ['', Validators.required],
            idOperatorTypePressure: ['', Validators.required],
            idUnitOfMeasurePressure: ['', Validators.required],
            physicalLocation:[''],
            civicNumber:['']
        });
    }

    public getMapLocalization(){
    }

}
