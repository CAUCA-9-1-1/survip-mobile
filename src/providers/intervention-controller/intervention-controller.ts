import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionPlanBuildingForlist} from '../../models/intervention-plan-building-forlist';

/*
  Generated class for the InterventionControllerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class InterventionControllerProvider {

  public interventionPlan: InterventionPlan;

  constructor(public http: Http) {
    console.log('Hello InterventionControllerProvider Provider');
  }

  loadPlan(idInterventionPlan: string){
    this.interventionPlan = new InterventionPlan();
    this.interventionPlan.mainBuildingAddress='750, Boulevard Lacroix';
    this.interventionPlan.mainBuildingAlias='Bâtiment principal';
    this.interventionPlan.mainBuildingIdLane='1';
    this.interventionPlan.planName='nom';
    this.interventionPlan.planNumber='a939'
    this.interventionPlan.mainBuildingIdRiskLevel='dddecfea-94e3-4c51-988b-b0eb83fab14a';
    this.interventionPlan.mainBuildingAffectation='1000 - Résidence';
    this.interventionPlan.mainBuildingMatricule='98354671000000000';
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

  }
}
