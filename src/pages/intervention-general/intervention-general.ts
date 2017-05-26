import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {InterventionPlan} from '../../models/intervention-plan';
import {RiskLevel} from '../../models/risk-level';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';

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
export class InterventionGeneralPage {
  planForm: FormGroup;

  plan: InterventionPlan;
  riskLevel: RiskLevel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              private controller: InterventionControllerProvider,
              private riskLevelService: RiskLevelRepositoryProvider) {
    this.createForm();
    this.startWatchingForm();
  }

  ionViewDidLoad() {
    this.plan = this.controller.interventionPlan;
    this.setValues();
    this.loadRiskLevel();
  }

  createForm() {
    this.planForm = this.fb.group({
      idLaneTransversal: ['']
    });
  }

  loadRiskLevel() {
    if (this.plan != null) {
      this.riskLevelService.getById(this.plan.mainBuildingIdRiskLevel)
        .subscribe(result => this.riskLevel = result);
    }
  }

  private startWatchingForm() {
    this.planForm.valueChanges
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
    console.log('saving plan...');
    const formModel  = this.planForm.value;
    Object.assign(this.plan, formModel);
    console.log('todo: plan saved');
    this.controller.savePlan();
  }

  clickTest(){
    console.log('test click sur input');
  }
}
