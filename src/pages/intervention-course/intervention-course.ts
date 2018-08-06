import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionBuildingCourseForList} from '../../models/inspection-building-course-for-list';
import {InspectionBuildingCourseRepositoryProvider} from '../../providers/repositories/inspection-building-course-repository';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-intervention-course',
    templateUrl: 'intervention-course.html',
})
export class InterventionCoursePage {

    private hasNavigated: boolean = true;

    public courses: InspectionBuildingCourseForList[] = [];
    public labels = {};

    get plan(): InspectionDetail {
        return this.controller.inspectionDetail
    }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public controller: InspectionControllerProvider,
        private load: LoadingController,
        private courseRepo: InspectionBuildingCourseRepositoryProvider,
        private authService: AuthenticationService,
        private translateService: TranslateService) {
    }

    public ngOnInit() {
        this.translateService.get([
            'waitFormMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public ionViewDidEnter() {
        if (this.hasNavigated) {
            this.hasNavigated = false;
            this.loadCourseList();
        }
    }

    public loadCourseList() {
        let loader = this.load.create({content: this.labels['waitFromMessage']});
        const result = this.courseRepo.getList(this.controller.idInspection);
        result.subscribe(data => {
            this.courses = data as InspectionBuildingCourseForList[];
            loader.dismiss();
        });
    }

    public async ionViewCanEnter() {
        let isLoggedIn = await this.authService.isStillLoggedIn();
        if (!isLoggedIn)
            this.redirectToLoginPage();
    }

    private redirectToLoginPage() {
        this.navCtrl.setRoot('LoginPage');
    }

    public onItemClick(idInspectionBuildingCourse: string) {
        this.hasNavigated = true;
        this.navCtrl.push("InterventionCourseDetailPage", {idInspectionBuildingCourse: idInspectionBuildingCourse});
    }
}
