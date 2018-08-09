import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, reorderArray} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {FirestationForlist} from '../../models/firestation';
import {FirestationRepositoryProvider} from '../../providers/repositories/firestation-repository-provider.service';
import {InspectionBuildingCourse} from '../../models/inspection-building-course';
import {InspectionBuildingCourseLaneForList} from '../../models/inspection-building-course-lane-for-list';
import {InspectionBuildingCourseRepositoryProvider} from '../../providers/repositories/inspection-building-course-repository';
import {InspectionBuildingCourseLaneRepositoryProvider} from '../../providers/repositories/inspection-building-course-lane-repository-provider.service';
import {UUID} from 'angular2-uuid';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-intervention-course-detail',
    templateUrl: 'intervention-course-detail.html',
})
export class InterventionCourseDetailPage {
    private hasNavigated: boolean = true;
    private idInspectionFormCourse: string;

    public course: InspectionBuildingCourse;
    public courseLanes: InspectionBuildingCourseLaneForList[] = [];
    public firestations: FirestationForlist[] = [];
    public form: FormGroup;
    public changeOrder = false;
    public labels = {};
    public changeCourseAction: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private firestationRepo: FirestationRepositoryProvider,
        private courseRepo: InspectionBuildingCourseRepositoryProvider,
        private courseLaneRepo: InspectionBuildingCourseLaneRepositoryProvider,
        public controller: InspectionControllerProvider,
        private alertCtrl: AlertController,
        private load: LoadingController,
        private fb: FormBuilder,
        private translateService: TranslateService) {

        this.createForm();
        this.idInspectionFormCourse = navParams.get('idInspectionBuildingCourse');
    }

    public ngOnInit() {
        this.translateService.get([
            'yes', 'no', 'confirmation', 'courseDetailLeaveMessage', 'warning', 'courseLaneValidationMessage',
            'courseDetailDeleteQuestion', 'waitFormMessage', 'cancel', 'finish', 'courseOrderChange'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
        this.changeCourseOrderAction();
    }

    public async ionViewDidEnter() {
        if (this.hasNavigated) {
            let loader = this.load.create({content: this.labels['waitFormMessage']});
            loader.present();
            await this.loadFirestations();
            await this.loadSpecificCourse(this.idInspectionFormCourse);
            await loader.dismiss();
        }
    }

    public ionViewCanLeave() {
        if (this.form.dirty || !this.form.valid) {
            return new Promise((resolve, reject) => {
                let alert = this.alertCtrl.create({
                    title: this.labels['confirmation'],
                    message: this.labels['courseDetailLeaveMessage'],
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

    private loadSpecificCourse(idInterventionFormCourse: string) {
        if (idInterventionFormCourse == null) {
            this.createPlanCourse();
            this.setValuesAndStartListening();
        }
        else {
            const result = this.courseRepo.get(idInterventionFormCourse);
            result.subscribe(data => {
                this.course = data.course as InspectionBuildingCourse;
                this.courseLanes = data.lanes;
                this.setValuesAndStartListening();
            });
        }
    }

    public createPlanCourse() {
        let course = new InspectionBuildingCourse();
        course.id = UUID.UUID();
        this.idInspectionFormCourse = course.id;
        course.idBuilding = this.controller.inspectionDetail.idBuilding;
        this.course = course;
        this.courseLanes = [];
    }

    private async loadFirestations() {
        const result = await this.firestationRepo.getList(this.controller.inspectionDetail.idCity);
        this.firestations = result;
    }

    private createForm() {
        this.form = this.fb.group({idFirestation: ['', Validators.required]});
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
        if (this.course != null) {
            this.form.patchValue(this.course);
        }
    }

    private saveIfValid() {
        if (this.form.valid && this.form.dirty) {
            this.saveForm();
        }
    }

    private saveForm() {
        const formModel = this.form.value;
        Object.assign(this.course, formModel);
        this.saveCourse();
        this.form.markAsPristine();
    }

    public onChangeOrder(): void {
        this.changeOrder = !this.changeOrder;
        this.changeCourseOrderAction();
    }

    public async onReorderLane(indexes) {
        this.courseLanes = reorderArray(this.courseLanes, indexes);
        await this.setLanesSequenceAndSave();
    }

    public async setLanesSequenceAndSave() {
        for (let i = 0; i < this.courseLanes.length; i++) {
            let item = this.courseLanes[i];
            if (item.sequence != i + 1) {
                item.sequence = i + 1;
                await this.courseLaneRepo.saveCourseLaneSequence(item.id, item.sequence);
            }
        }
    }

    public onClickLane(idInspectionBuildingCourseLane: string): void {
        if (idInspectionBuildingCourseLane == null && !this.form.valid) {
            let alert = this.alertCtrl.create({
                title: this.labels['warning'],
                message: this.labels['courseLaneValidationMessage'],
                buttons: ['Ok']
            });

            alert.present();
        } else
            this.navigateToLanePage(idInspectionBuildingCourseLane);
    }

    private navigateToLanePage(idInspectionBuildingCourseLane: string) {
        this.hasNavigated = true;
        this.navCtrl.push("InterventionCourseLanePage", {
            idInspectionBuildingCourseLane: idInspectionBuildingCourseLane,
            idInspectionBuildingCourse: this.idInspectionFormCourse,
            nextSequence: this.courseLanes.length + 1
        });
    }

    private onDeleteCourse() {
        let alert = this.alertCtrl.create({
            title: this.labels['confirmation'],
            message: this.labels['courseDetailDeleteQuestion'],
            buttons: [
                {text: this.labels['no'], role: this.labels['cancel']},
                {
                    text: this.labels['yes'], handler: () => {
                        this.deleteCourse().subscribe(() => this.goBack());
                    }
                }
            ]
        });
        alert.present();
    }

    private saveCourse() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        loader.present();
        this.courseRepo.save(this.course)
            .subscribe(ok => {
                loader.dismiss();
            })
    }

    private deleteCourse() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        loader.present();
        let result = this.courseRepo.delete(this.course);
        loader.dismiss();
        return result;
    }

    private goBack(): void {
        this.navCtrl.pop();
    }

    public changeCourseOrderAction() {
        this.changeCourseAction = this.labels['finish']
        if (!this.changeOrder) {
            this.changeCourseAction = this.labels['courseOrderChange'];
        }
    }
}
