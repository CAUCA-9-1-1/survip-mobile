import {Component, OnDestroy} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {InterventionPlan} from '../../models/intervention-plan';
import {RiskLevel} from '../../models/risk-level';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {ISubscription} from 'rxjs/Subscription';

/**
 * Generated class for the InterventionGeneralPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-intervention-general',
  templateUrl: 'intervention-general.html',
})
export class InterventionGeneralPage implements OnDestroy {
  ngOnDestroy(): void {
    //this.planSubscription.unsubscribe();
    //this.planSubscription.unsubscribe();
  }

  planForm: FormGroup;
  planSubscription: ISubscription;
  idLaneTransversal: string;

  get plan(): InterventionPlan{
    return this.controller.interventionPlan
  }

  riskLevel: RiskLevel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              private controller: InterventionControllerProvider,
              private riskLevelService: RiskLevelRepositoryProvider,
              public laneService: LaneRepositoryProvider) {
    this.createForm();
    controller.planLoaded.subscribe(() => this.setValuesAndStartListening());
  }

  ionViewDidLoad() {
    this.controller.loadInterventionPlan(this.navParams.data['id']);
  }

  setValuesAndStartListening() {
    this.idLaneTransversal = this.plan.idLaneTransversal;
    this.setValues();
    this.loadRiskLevel();
    this.startWatchingForm();
  }

  createForm() {
    this.planForm = this.fb.group({
      idLaneTransversal: ['']
    });
  }

  loadRiskLevel() { // why am i loading this exactly?
    if (this.plan != null) {
      this.riskLevelService.getById(this.plan.mainBuildingIdRiskLevel)
        .subscribe(result => this.riskLevel = result);
    }
  }

  private startWatchingForm() {
    this.planSubscription = this.planForm.valueChanges
      .debounceTime(500)
      .subscribe(() => this.saveIfValid());
  }

  private setValues() {
    if (this.plan != null) {
      this.planForm.patchValue(this.plan);
    }
  }

  private saveIfValid() {
    if (this.planForm.valid && this.planForm.dirty) {
      this.saveForm();
    }
  }

  private saveForm() {
    const formModel  = this.planForm.value;
    Object.assign(this.controller.interventionPlan, formModel);
    this.controller.savePlan();
  }
}
