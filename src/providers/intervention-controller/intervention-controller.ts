import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionPlanBuildingForlist} from '../../models/intervention-plan-building-forlist';
import {InterventionDetailRepositoryProvider} from '../repositories/intervention-detail-repository';
import {LaneRepositoryProvider} from '../repositories/lane-repository';
import {Observable} from 'rxjs/Observable';
import {Loading, LoadingController} from 'ionic-angular';

@Injectable()
export class InterventionControllerProvider {
  public interventionPlan: InterventionPlan;
  private loading: Loading

  constructor(
    private repository: InterventionDetailRepositoryProvider,
    private loadingCtrl: LoadingController,
    private laneRepo: LaneRepositoryProvider
  ) {
    this.loading = this.loadingCtrl.create({content: 'Patientez...'});
    this.loading.present();
    console.log('Hello InterventionControllerProvider Provider');
  }

  getPlan(idInterventionPlan: string): Observable<InterventionPlan>{
    const result = this.repository.get('0ea6b45c-e437-4dcf-9db8-4d2d015d025c');
    result.subscribe(data => {
      const plan: InterventionPlan = data as InterventionPlan;
      this.laneRepo.currentIdCity = plan.idCity;
      this.interventionPlan = plan;
      this.loading.dismiss();
      });

    return result;
  }

  getBuildingList(): InterventionPlanBuildingForlist[] {
    var building = new InterventionPlanBuildingForlist();
    building.id = '1';
    building.alias = 'Résidence';
    building.idRiskLevel='dddecfea-94e3-4c51-988b-b0eb83fab14a';
    building.picture='';

    var building2 = new InterventionPlanBuildingForlist();
    building2.id = '1';
    building2.alias = 'Remise à machinerie';
    building2.idRiskLevel='dddecfea-94e3-4c51-988b-b0eb83fab14a';
    building2.picture='';

    var buildings: InterventionPlanBuildingForlist[] = [];
    buildings.push(building);
    buildings.push(building);

    return buildings;
  }

  savePlan(){
    console.log("saving plan");
    console.log(this.interventionPlan);
    this.repository.saveTraversalLane(this.interventionPlan.id, this.interventionPlan.idLaneTransversal)
      .subscribe(ok => {
        console.log("Saved", ok);
      });
  }
}
