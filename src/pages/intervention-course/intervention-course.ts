import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionBuildingCourseForList} from '../../models/inspection-building-course-for-list';
import {InspectionBuildingCourseRepositoryProvider} from '../../providers/repositories/inspection-building-course-repository';

@IonicPage()
@Component({
  selector: 'page-intervention-course',
  templateUrl: 'intervention-course.html',
})
export class InterventionCoursePage {

  private hasNavigated: boolean = true;
  public courses: InspectionBuildingCourseForList[] = [];

  get plan(): InspectionDetail{
    return this.controller.inspectionDetail
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public controller: InspectionControllerProvider,
    private load: LoadingController,
    private courseRepo: InspectionBuildingCourseRepositoryProvider,
    private authService: AuthenticationService) {
  }

  ionViewDidEnter() {
    if (this.hasNavigated) {
      this.hasNavigated = false;
      this.loadCourseList();
    }
  }

  public orderBy(list: any[], field: string): any[] {
    let sorted = list.sort((t1, t2) => {
      if (t1[field] > t2[field])
        return 1;
      if (t1[field]< t2[field])
        return -1;
      return 0;
    });
    return sorted;
  }

  loadCourseList() {
    let loader = this.load.create({content: 'Patientez...'});
    const result = this.courseRepo.getList(this.controller.idInspection);
    result.subscribe(data => {
      this.courses = data as InspectionBuildingCourseForList[];
      loader.dismiss();
    });
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(){
    this.navCtrl.setRoot('LoginPage');
  }

  onItemClick(idInspectionBuildingCourse: string) {
    this.hasNavigated = true;
    this.navCtrl.push("InterventionCourseDetailPage", {idInspectionBuildingCourse: idInspectionBuildingCourse});
  }
}
