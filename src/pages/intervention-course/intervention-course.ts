import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionBuildingCourseForList} from '../../models/inspection-building-course-for-list';
import {InspectionBuildingCourseRepositoryProvider} from '../../providers/repositories/inspection-building-course-repository';
import {TranslateService} from "@ngx-translate/core";
import {Inspection} from "../../interfaces/inspection.interface";

@IonicPage()
@Component({
    selector: 'page-intervention-course',
    templateUrl: 'intervention-course.html',
})
export class InterventionCoursePage {

    private hasNavigated: boolean = true;

    public courses: InspectionBuildingCourseForList[] = [];
    public labels = {};

  public get currentInspection(): Inspection {
    return this.controller.currentInspection;
  }

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public controller: InspectionControllerProvider,
        private load: LoadingController,
        private courseRepo: InspectionBuildingCourseRepositoryProvider,
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
        this.courseRepo.getList(this.controller.getMainBuilding().idBuilding, this.controller.currentInspection.idCity)
          .then(data => {
            this.courses = data;
            loader.dismiss();
          })
    }

    public onItemClick(idInspectionBuildingCourse: string) {
        this.hasNavigated = true;
        this.navCtrl.push("InterventionCourseDetailPage", {idInspectionBuildingCourse: idInspectionBuildingCourse});
    }
}
