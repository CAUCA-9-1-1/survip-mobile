import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {RouteDirectionRepositoryProvider} from '../../providers/repositories/route-direction-repository';
import {RouteDirection} from '../../models/route-direction';
import {AuthenticationService} from '../../providers/Base/authentification.service';
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
    form: FormGroup;
    directions: RouteDirection[];
    courseLane: InspectionBuildingCourseLane;
    labels = {};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private load: LoadingController,
        private courseLaneRepo: InspectionBuildingCourseLaneRepositoryProvider,
        private authService: AuthenticationService,
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

    ngOnInit() {
        this.translateService.get([
            'yes', 'no', 'confirmation', 'laneLeaveMessage', 'waitFormMessage', 'cancel', 'laneDeleteQuestion'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    async loadSpecificCourseLane(idInspectionBuildingCourseLane: string) {
        if (idInspectionBuildingCourseLane == null) {
            this.createPlanCourseLane();
        } else {
            const result = await this.courseLaneRepo.getLane(idInspectionBuildingCourseLane);
            this.courseLane = result;
        }
        this.setValuesAndStartListening();
    }

    createPlanCourseLane() {
        let lane = new InspectionBuildingCourseLane();
        lane.id = UUID.UUID();
        this.idInspectionBuildingCourseLane = lane.id;
        lane.idBuildingCourse = this.idInspectionBuildingCourse;
        lane.direction = 2;
        lane.sequence = this.nextSequence;
        this.courseLane = lane;
    }

    async ionViewDidLoad() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        loader.present();
        this.directions = await this.directionRepo.getList();
        await this.loadSpecificCourseLane(this.idInspectionBuildingCourseLane);
        loader.dismiss();
    }

    async ionViewCanEnter() {
        let isLoggedIn = await this.authService.isStillLoggedIn();
        if (!isLoggedIn)
            this.redirectToLoginPage();
    }

    private redirectToLoginPage() {
        this.navCtrl.setRoot('LoginPage');
    }

    ionViewCanLeave() {
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

    setValuesAndStartListening() {
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

    async deleteThenGoBack() {
        await this.deleteCourseLane();
        this.goBack();
    }

    async saveCourseLane() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        loader.present();
        await this.courseLaneRepo.save(this.courseLane);
        loader.dismiss();
    }

    async deleteCourseLane(): Promise<any> {
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
