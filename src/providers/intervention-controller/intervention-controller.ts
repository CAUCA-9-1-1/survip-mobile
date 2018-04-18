import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {InterventionFormBuildingForList} from '../../models/intervention-form-building-for-list';
import {InterventionDetailRepositoryProvider} from '../repositories/intervention-detail-repository';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {LoadingController} from 'ionic-angular';
import {InterventionBuildingsRepositoryProvider} from '../repositories/intervention-buildings-repository';
import {PictureData} from '../../models/picture-data';
import {PictureRepositoryProvider} from '../repositories/picture-repository';
import {InterventionFormCourse} from '../../models/intervention-form-course';
import {InterventionFormCourseRepositoryProvider} from '../repositories/intervention-form-course-repository';
import {InterventionFormCourseForList} from '../../models/intervention-form-course-for-list';
import {InterventionFormCourseLane} from '../../models/intervention-form-course-lane';
import {FirestationForlist} from '../../models/firestation';
import {FirestationRepositoryProvider} from '../repositories/firestation-repository';
import {InterventionFormCourseLaneForList} from '../../models/intervention-form-course-lane-for-list';
import {Observable} from 'rxjs/Observable';
import {InterventionForm} from '../../models/intervention-form';
import {InterventionFormCourseLaneRepositoryProvider} from '../repositories/intervention-form-course-lane-repository';

@Injectable()
export class InterventionControllerProvider {
  public courses : InterventionFormCourseForList[];
  public courseLanes : InterventionFormCourseLaneForList[]
  public buildings: InterventionFormBuildingForList[];
  public firestations: FirestationForlist[];

  public interventionPlan: InterventionForm;
  public picture: PictureData;
  public course: InterventionFormCourse;
  public courseLane: InterventionFormCourseLane;

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
    private courseRepo: InterventionFormCourseRepositoryProvider,
    private courseLaneRepo : InterventionFormCourseLaneRepositoryProvider,
    private firestationRepo: FirestationRepositoryProvider
  ) {}

  loadInterventionPlan(idInterventionPlan: string){
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.repoDetail.get('0ea6b45c-e437-4dcf-9db8-4d2d015d025c');
    result.subscribe(data => {
      const plan: InterventionForm = data as InterventionForm;
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
      this.courses = data as InterventionFormCourseForList[];
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
        this.course = data.course as InterventionFormCourse;
        this.courseLanes = data.lanes;
        this.courseLoaded.emit(null);
        loading.dismiss();
      });
    }
  }

  createPlanCourse() {
    var course = new InterventionFormCourse();
    course.idInterventionForm = this.interventionPlan.id;
    this.course = course;
    this.courseLanes = [];
  }

  loadSpecificCourseLane(idInterventionPlanCourseLane: string) {
    const loading = this.createLoadingControl();
    loading.present();
    if (idInterventionPlanCourseLane == null){
      this.createPlanCourseLane();
      this.courseLaneLoaded.emit(null);
      loading.dismiss();
    } else {
      const result = this.courseLaneRepo.get(idInterventionPlanCourseLane);
      result.subscribe(data => {
        this.courseLane = data as InterventionFormCourseLane;
        this.courseLaneLoaded.emit(null);
        loading.dismiss();
      });
    }
  }

  createPlanCourseLane() {
    var lane = new InterventionFormCourseLane();
    lane.idInterventionFormCourse = this.course.id;
    lane.direction = 0;
    lane.sequence = this.courseLanes.length + 1;
    this.courseLane = lane;
  }

  loadBuildingList() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.repoBuildings.get('0ea6b45c-e437-4dcf-9db8-4d2d015d025c');
    result.subscribe(data => {
      this.buildings = data as InterventionFormBuildingForList[];
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
    return this.courseRepo.delete(this.course);
  }

  saveCourseLane(){
    console.log('saving course lane');
    this.courseLaneRepo.save(this.courseLane)
      .subscribe(ok => {
        console.log("Course lane saved", ok);
      });
  }

  deleteCourseLane(): Observable<any>{
    return this.courseLaneRepo.delete(this.courseLane);
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
