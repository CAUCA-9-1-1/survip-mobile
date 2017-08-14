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

@Injectable()
export class InterventionControllerProvider {
  public interventionPlan: InterventionPlan;
  public buildings: InterventionPlanBuildingForlist[];
  public picture: PictureData;

  public planLoaded: EventEmitter<any> = new EventEmitter<any>();
  public pictureLoaded: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private repoDetail: InterventionDetailRepositoryProvider,
    private repoBuildings: InterventionBuildingsRepositoryProvider,
    private loadingCtrl: LoadingController,
    private laneRepo: LaneRepositoryProvider,
    private pictureRepo: PictureRepositoryProvider
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

  loadBuildingList() {
    const loading = this.createLoadingControl();
    loading.present();
    const result = this.repoBuildings.get('0ea6b45c-e437-4dcf-9db8-4d2d015d025c');
    result.subscribe(data => {
      this.buildings = data as InterventionPlanBuildingForlist[];
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
      console.log(data);
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
}
