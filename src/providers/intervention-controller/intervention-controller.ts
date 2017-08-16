import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionPlanBuildingForlist} from '../../models/intervention-plan-building-forlist';
import {InterventionDetailRepositoryProvider} from '../repositories/intervention-detail-repository';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {LoadingController} from 'ionic-angular';
import {InterventionBuildingsRepositoryProvider} from '../repositories/intervention-buildings-repository';
import {PictureData} from '../../models/picture-data';
import {PictureRepositoryProvider} from '../repositories/picture-repository';
import {InterventionPlanCourse} from '../../models/intervention-plan-course';
import {InterventionPlanCourseRepositoryProvider} from '../repositories/intervention-plan-course-repository';
import {InterventionPlanCourseForlist} from '../../models/intervention-plan-course-forlist';
import {InterventionPlanCourseLaneRepositoryProvider} from '../repositories/intervention-plan-course-lane-repository';
import {InterventionPlanCourseLane} from '../../models/intervention-plan-course-lane';
import {FirestationForlist} from '../../models/firestation';
import {FirestationRepositoryProvider} from '../repositories/firestation-repository';
import {InterventionPlanCourseLaneForlist} from '../../models/intervention-plan-course-lane-forlist';

@Injectable()
export class InterventionControllerProvider {
  public courses : InterventionPlanCourseForlist[];
  public courseLanes : InterventionPlanCourseLaneForlist[]
  public buildings: InterventionPlanBuildingForlist[];
  public firestations: FirestationForlist[];

  public interventionPlan: InterventionPlan;
  public picture: PictureData;
  public course: InterventionPlanCourse;
  public courseLane: InterventionPlanCourseLane;

  public planLoaded: EventEmitter<any> = new EventEmitter<any>();
  public pictureLoaded: EventEmitter<any> = new EventEmitter<any>();
  public courseLoaded: EventEmitter<any> = new EventEmitter<any>();
  public courseLaneLoaded: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private repoDetail: InterventionDetailRepositoryProvider,
    private repoBuildings: InterventionBuildingsRepositoryProvider,
    private loadingCtrl: LoadingController,
    private laneRepo: LaneRepositoryProvider,
    private pictureRepo: PictureRepositoryProvider,
    private courseRepo: InterventionPlanCourseRepositoryProvider,
    private courseLaneRepo : InterventionPlanCourseLaneRepositoryProvider,
    private firestationRepo: FirestationRepositoryProvider
  ) {}

  loadInterventionPlan(idInterventionPlan: string){
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.repoDetail.get('0ea6b45c-e437-4dcf-9db8-4d2d015d025c');
    result.subscribe(data => {
      const plan: InterventionPlan = data as InterventionPlan;
      this.laneRepo.currentIdCity = plan.idCity;
      this.interventionPlan = plan;
      this.planLoaded.emit(null);
      loading.dismiss();
      });
  }

  loadCourseList() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.courseRepo.getList(this.interventionPlan.id);
    result.subscribe(data => {
      this.courses = data as InterventionPlanCourseForlist[];
      loading.dismiss();
    });
  }

  loadSpecificCourse(idInterventionPlanCourse: string) {
    const loading = this.createLoadingControl();
    loading.present();

    if (idInterventionPlanCourse == null) {
      this.createPlanCourse();
      this.courseLoaded.emit(null);
      loading.dismiss();
    }
    else {
      const result = this.courseRepo.get(idInterventionPlanCourse);
      result.subscribe(data => {
        this.course = data.course as InterventionPlanCourse;
        this.courseLanes = data.lanes;
        this.courseLoaded.emit(null);
        loading.dismiss();
      });
    }
  }

  createPlanCourse() {
    var course = new InterventionPlanCourse();
    course.idInterventionPlan = this.interventionPlan.id;
    this.course = course;
    this.courseLanes = [];
  }

  loadSpecificCourseLane(idInterventionPlanCourseLane: string) {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.courseLaneRepo.get(idInterventionPlanCourseLane);
    result.subscribe(data => {
      this.courseLane = data as InterventionPlanCourseLane;
      this.courseLaneLoaded.emit(null);
      loading.dismiss();
    });
  }

  loadBuildingList() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.repoBuildings.get('0ea6b45c-e437-4dcf-9db8-4d2d015d025c');
    result.subscribe(data => {
      this.buildings = data as InterventionPlanBuildingForlist[];
      loading.dismiss();
    });
  }

  loadFirestations() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.firestationRepo.getList();
    result.subscribe(data => {
      this.firestations = data as FirestationForlist[];
      loading.dismiss();
    });
  }

  private createLoadingControl() {
    return this.loadingCtrl.create({content: 'Chargement...'});
  }

  loadInterventionPlanPicture() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.pictureRepo.getPicture(this.interventionPlan.idPictureSitePlan);
    result.subscribe(data => {
      this.picture = data as PictureData;
      this.pictureLoaded.emit(null);
      loading.dismiss();
    });
  }

  savePicture() {
    this.pictureRepo.savePicture(this.picture)
      .subscribe(response => {
        if (this.interventionPlan.idPictureSitePlan == null)
          this.savePlanIdPicture(response.json()['idPicture']);
      });
  }

  private savePlanIdPicture(idPicture: string) {
    this.interventionPlan.idPictureSitePlan = idPicture;
    this.repoDetail.savePlanField(this.interventionPlan.id, 'idPictureSitePlan', this.interventionPlan.idPictureSitePlan)
      .subscribe(ok => {
        console.log("Picture saved", ok);
      });
  }

  savePlan(){
    this.repoDetail.savePlanField(this.interventionPlan.id, 'idLaneTransversal', this.interventionPlan.idLaneTransversal)
      .subscribe(ok => {
        console.log("Plan saved", ok);
      });
  }

  saveCourse(){
    this.courseRepo.save(this.course)
      .subscribe(ok => {
        console.log("Course saved", ok);
      })
  }

  deleteCourse(){
    this.courseRepo.delete(this.course)
      .subscribe(ok => {
        console.log("Course deleted", ok);
      });
  }

  saveCourseLane(){
    this.courseLaneRepo.save(this.courseLane)
      .subscribe(ok => {
        console.log("Course lane saved", ok);
      });
  }

  deleteCourseLane(){
    this.courseLaneRepo.delete(this.courseLane)
      .subscribe(ok => {
        console.log("Course lane deleted", ok);
      });
  }

  setLanesSequenceAndSave() {
    for(var i = 0; i < this.courseLanes.length; i++) {
      var item = this.courseLanes[i];
      if (item.sequence != i + 1) {
        item.sequence = i + 1;
        this.courseLaneRepo.saveCourseLane(item).subscribe(ok => {});
      }
    }
  }
}
