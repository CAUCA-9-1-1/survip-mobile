import {Component, OnDestroy} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {RiskLevel} from '../../models/risk-level';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {ISubscription} from 'rxjs/Subscription';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {InterventionForm} from '../../models/intervention-form';
import {UtilisationCodeRepositoryProvider} from '../../providers/repositories/utilisation-code-repository';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';

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
  laneName: string;
  utilisationCodeName;

  get plan(): InspectionDetail{
    return this.controller.inspectionDetail
  }

  riskLevel: RiskLevel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fb: FormBuilder,
              private authService: AuthenticationService,
              private controller: InspectionControllerProvider,
              private riskLevelService: RiskLevelRepositoryProvider,
              public laneService: LaneRepositoryProvider,
              private utilisationCodeService: UtilisationCodeRepositoryProvider) {
    console.log("general page", controller.idInspection);
    this.createForm();
    controller.planLoaded.subscribe(() => this.setValuesAndStartListening());
  }

  ionViewDidLoad() {
    console.log('coudonc ionviewload general', this.navParams.data);
    this.controller.loadInterventionForm();
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(){
    this.navCtrl.setRoot('LoginPage');
  }

  setValuesAndStartListening() {
    this.idLaneTransversal = this.plan.idLaneTransversal;
    this.setValues();
    this.loadRiskLevel();
    this.loadLaneName();
    this.loadUtilisationCode();
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

  loadLaneName() {
    if (this.plan != null){
      this.laneService.getDescriptionById(this.plan.mainBuildingIdLane)
        .subscribe(result => this.laneName = result);
    }
  }

  loadUtilisationCode() {
    if (this.plan != null){
      this.utilisationCodeService.get(this.plan.mainBuildingIdUtilisationCode)
        .subscribe(result => this.utilisationCodeName = result.name);
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
    Object.assign(this.controller.inspectionDetail, formModel);
    this.controller.savePlanTransversal();
  }
}
