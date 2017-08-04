import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionPlanBuildingForlist} from '../../models/intervention-plan-building-forlist';
import {InterventionDetailRepositoryProvider} from '../repositories/intervention-detail-repository';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {Observable} from 'rxjs/Observable';
import {Loading, LoadingController} from 'ionic-angular';
import {InterventionBuildingsRepositoryProvider} from '../repositories/intervention-buildings-repository';

@Injectable()
export class InterventionControllerProvider {
  public interventionPlan: InterventionPlan;
  public buildings: InterventionPlanBuildingForlist[];

  constructor(
    private repoDetail: InterventionDetailRepositoryProvider,
    private repoBuildings: InterventionBuildingsRepositoryProvider,
    private loadingCtrl: LoadingController,
    private laneRepo: LaneRepositoryProvider
  ) {
    console.log('Hello InterventionControllerProvider Provider');
  }

  getPlan(idInterventionPlan: string): Observable<InterventionPlan>{
    const loading = this.loadingCtrl.create({content: 'Patientez...'});
    loading.present();
    const result = this.repoDetail.get('0ea6b45c-e437-4dcf-9db8-4d2d015d025c');
    result.subscribe(data => {
      const plan: InterventionPlan = data as InterventionPlan;
      this.laneRepo.currentIdCity = plan.idCity;
      this.interventionPlan = plan;
      loading.dismiss();
      });

    return result;
  }

  getBuildingList(): Observable<InterventionPlanBuildingForlist[]> {
    const loading = this.loadingCtrl.create({content: 'Patientez...'});
    loading.present();
    const result = this.repoBuildings.get('0ea6b45c-e437-4dcf-9db8-4d2d015d025c');
    result.subscribe(data => {
      this.buildings = data as InterventionPlanBuildingForlist[];
      loading.dismiss();
    });
    return result;
  }

  savePlan(){
    console.log("saving plan");
    console.log(this.interventionPlan);
    this.repoDetail.saveTraversalLane(this.interventionPlan.id, this.interventionPlan.idLaneTransversal)
      .subscribe(ok => {
        console.log("Saved", ok);
      });
  }
}
