import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {RouteDirectionRepositoryProvider} from '../../providers/repositories/route-direction-repository';
import {RouteDirection} from '../../models/route-direction';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionBuildingCourseLane} from '../../models/inspection-building-course-lane';
import {InspectionBuildingCourseLaneRepositoryProvider} from '../../providers/repositories/inspection-building-course-lane-repository-provider.service';
import {UUID} from 'angular2-uuid';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-intervention-course-lane',
    templateUrl: 'intervention-course-lane.html',
})
export class InterventionCourseLanePage {
    private idInspectionBuildingCourseLane: string;
    private readonly idInspectionBuildingCourse: string;
    private readonly nextSequence: number;

    public form: FormGroup;
    public directions: RouteDirection[];
    public courseLane: InspectionBuildingCourseLane;
    public labels = {};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private load: LoadingController,
        private courseLaneRepo: InspectionBuildingCourseLaneRepositoryProvider,
        public controller: InspectionControllerProvider,
        private fb: FormBuilder,
        public laneRepo: LaneRepositoryProvider,
        private alertCtrl: AlertController,
        private directionRepo: RouteDirectionRepositoryProvider,
        private translateService: TranslateService) {

        this.idInspectionBuildingCourseLane = navParams.get('idInspectionBuildingCourseLane');
        this.idInspectionBuildingCourse = navParams.get('idInspectionBuildingCourse');
        this.nextSequence = navParams.get('nextSequence');
        this.createForm();
    }

    public ngOnInit() {
        this.translateService.get([
            'yes', 'no', 'confirmation', 'laneLeaveMessage', 'waitFormMessage', 'cancel', 'laneDeleteQuestion'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public async loadSpecificCourseLane(idInspectionBuildingCourseLane: string) {
        if (idInspectionBuildingCourseLane == null) {
            this.createPlanCourseLane();
        } else {
            const result = await this.courseLaneRepo.getLane(idInspectionBuildingCourseLane);
            this.courseLane = result;
        }
        this.setValuesAndStartListening();
    }

    public createPlanCourseLane() {
        let lane = new InspectionBuildingCourseLane();
        lane.id = UUID.UUID();
        this.idInspectionBuildingCourseLane = lane.id;
        lane.idBuildingCourse = this.idInspectionBuildingCourse;
        lane.direction = 2;
        lane.sequence = this.nextSequence;
        this.courseLane = lane;
    }

    public async ionViewDidLoad() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        loader.present();
        try {
          this.directions = await this.directionRepo.getList();
          await this.loadSpecificCourseLane(this.idInspectionBuildingCourseLane);
        } finally {
          loader.dismiss();
        }
    }

    public ionViewCanLeave() {
        if (this.form.dirty || !this.form.valid) {
            return new Promise((resolve, rejeect) => {
                let alert = this.alertCtrl.create({
                    title: this.labels['confirmation'],
                    message: this.labels['laneLeaveMessage'],
                    buttons: [
                        {
                            text: this.labels['no'], handler: () => {
                                resolve(false);
                            }
                        },
                        {
                            text: this.labels['yes'], handler: () => {
                                resolve(true);
                            }
                        }
                    ]
                });

                return alert.present()
            });
        }
    }

    private createForm(): void {
        this.form = this.fb.group({
            idLane: ['', Validators.required],
            direction: [0]
        });
    }

    public setValuesAndStartListening() {
        this.setValues();
        this.startWatchingForm();
    }

    private startWatchingForm() {
        this.form.valueChanges
            .debounceTime(500)
            .subscribe(() => this.saveIfValid());
    }

    private setValues() {
        if (this.courseLane != null) {
            this.form.patchValue(this.courseLane);
        }
    }

    private async saveIfValid() {
        if (this.form.valid && this.form.dirty) {
            await this.saveForm();
        }
    }

    private async saveForm() {
        const formModel = this.form.value;
        Object.assign(this.courseLane, formModel);
        await this.saveCourseLane();
        this.form.markAsPristine();
    }

    public async onDeleteLane() {
        let alert = this.alertCtrl.create({
            title: this.labels['confirmation'],
            message: this.labels['laneDeleteQuestion'],
            buttons: [
                {text: this.labels['no'], role: this.labels['cancel']},
                {
                    text: this.labels['yes'], handler: () => {
                        this.deleteThenGoBack();
                    }
                }
            ]
        });

        await alert.present();
    }

    public async deleteThenGoBack() {
        await this.deleteCourseLane();
        this.goBack();
    }

    public async saveCourseLane() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        loader.present();
        try {
          await this.courseLaneRepo.save(this.courseLane);
        } finally {
          loader.dismiss();
        }
    }

    public async deleteCourseLane(): Promise<any> {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        loader.present();
        let result = await this.courseLaneRepo.delete(this.courseLane);
        loader.dismiss();
        return result;
    }

    private goBack(): void {
        this.navCtrl.pop();
    }
}
