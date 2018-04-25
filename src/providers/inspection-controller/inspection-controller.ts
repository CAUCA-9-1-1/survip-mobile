import {EventEmitter, Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {LoadingController} from 'ionic-angular';
import {PictureData} from '../../models/picture-data';
import {PictureRepositoryProvider} from '../repositories/picture-repository';
import {FirestationForlist} from '../../models/firestation';
import {Observable} from 'rxjs/Observable';
import {InspectionBuildingCourseForList} from '../../models/inspection-building-course-for-list';
import {InspectionBuildingCourseLaneForList} from '../../models/inspection-building-course-lane-for-list';
import {InspectionBuildingForList} from '../../models/inspection-building-for-list';
import {InspectionBuildingCourse} from '../../models/inspection-building-course';
import {InspectionBuildingCourseLane} from '../../models/inspection-building-course-lane';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionDetailRepositoryProvider} from '../repositories/inspection-detail-repository-provider.service';
import {InspectionBuildingsRepositoryProvider} from '../repositories/inspection-buildings-repository-provider.service';
import {InspectionBuildingCourseRepositoryProvider} from '../repositories/inspection-building-course-repository';
import {InspectionBuildingCourseLaneRepositoryProvider} from '../repositories/inspection-building-course-lane-repository-provider.service';
import {FirestationRepositoryProvider} from '../repositories/firestation-repository-provider.service';

@Injectable()
export class InspectionControllerProvider {
  public idInspection: string;

  public courses : InspectionBuildingCourseForList[];
  public courseLanes : InspectionBuildingCourseLaneForList[];
  public buildings: InspectionBuildingForList[];
  public firestations: FirestationForlist[];

  public inspectionDetail: InspectionDetail;
  public picture: PictureData;
  public course: InspectionBuildingCourse;
  public courseLane: InspectionBuildingCourseLane;

  public planLoaded: EventEmitter<any> = new EventEmitter<any>();
  public pictureLoaded: EventEmitter<any> = new EventEmitter<any>();
  public courseLoaded: EventEmitter<any> = new EventEmitter<any>();
  public courseLaneLoaded: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private repoDetail: InspectionDetailRepositoryProvider,
    private repoBuildings: InspectionBuildingsRepositoryProvider,
    private loadingCtrl: LoadingController,
    private laneRepo: LaneRepositoryProvider,
    private pictureRepo: PictureRepositoryProvider,
    private courseRepo: InspectionBuildingCourseRepositoryProvider,
    private courseLaneRepo : InspectionBuildingCourseLaneRepositoryProvider,
    private firestationRepo: FirestationRepositoryProvider
  ) {}

  public setIdInterventionForm(idInterventionForm: string){
    console.log('set', idInterventionForm);
    this.idInspection = idInterventionForm;
  }

  loadInterventionForm(){
    console.log("load");
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.repoDetail.get(this.idInspection);
    result.subscribe(data => {
      const plan: InspectionDetail = data as InspectionDetail;
      this.laneRepo.currentIdCity = plan.idCity;
      this.inspectionDetail = plan;
      this.planLoaded.emit(null);
      loading.dismiss();
      });
  }

  loadCourseList() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.courseRepo.getList(this.inspectionDetail.id);
    result.subscribe(data => {
      this.courses = data as InspectionBuildingCourseForList[];
      loading.dismiss();
    });
  }

  loadSpecificCourse(idInterventionFormCourse: string) {
    const loading = this.createLoadingControl();
    loading.present();

    if (idInterventionFormCourse == null) {
      this.createPlanCourse();
      this.courseLoaded.emit(null);
      loading.dismiss();
    }
    else {
      const result = this.courseRepo.get(idInterventionFormCourse);
      result.subscribe(data => {
        this.course = data.course as InspectionBuildingCourse;
        this.courseLanes = data.lanes;
        this.courseLoaded.emit(null);
        loading.dismiss();
      });
    }
  }

  createPlanCourse() {
    let course = new InspectionBuildingCourse();
    course.idBuilding = 'todo';
    this.course = course;
    this.courseLanes = [];
  }

  loadSpecificCourseLane(idInterventionFormCourseLane: string) {
    const loading = this.createLoadingControl();
    loading.present();
    if (idInterventionFormCourseLane == null){
      this.createPlanCourseLane();
      this.courseLaneLoaded.emit(null);
      loading.dismiss();
    } else {
      const result = this.courseLaneRepo.get(idInterventionFormCourseLane);
      result.subscribe(data => {
        this.courseLane = data as InspectionBuildingCourseLane;
        this.courseLaneLoaded.emit(null);
        loading.dismiss();
      });
    }
  }

  createPlanCourseLane() {
    let lane = new InspectionBuildingCourseLane();
    lane.idBuildingCourse = "todo";
    lane.direction = 0;
    lane.sequence = this.courseLanes.length + 1;
    this.courseLane = lane;
  }

  loadBuildingList() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.repoBuildings.get(this.idInspection);
    result.subscribe(data => {
      this.buildings = data as InspectionBuildingForList[];
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

  loadInterventionFormPicture() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.pictureRepo.getPicture(this.inspectionDetail.idPictureSitePlan);
    result.subscribe(data => {
      this.picture = data as PictureData;
      this.pictureLoaded.emit(null);
      loading.dismiss();
    });
  }

  async savePicture() {
    let idPicture = await this.pictureRepo.savePicture(this.picture);
    console.log('saved', idPicture);
    if (this.inspectionDetail.idPictureSitePlan != idPicture)
      this.savePlanIdPicture(idPicture as string);
  }

  private savePlanIdPicture(idPicture: string) {
    this.inspectionDetail.idPictureSitePlan = idPicture;
    this.repoDetail.savePicture(this.inspectionDetail.id, this.inspectionDetail.idPictureSitePlan)
      .subscribe(ok => {
        console.log("Picture saved", ok);
      });
  }

  savePlanTransversal(){
    this.repoDetail.savePlanLane(this.inspectionDetail.id, this.inspectionDetail.idLaneTransversal)
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
    for(let i = 0; i < this.courseLanes.length; i++) {
      let item = this.courseLanes[i];
      if (item.sequence != i + 1) {
        item.sequence = i + 1;
        this.courseLaneRepo.saveCourseLane(item).subscribe(ok => {});
      }
    }
  }
}
