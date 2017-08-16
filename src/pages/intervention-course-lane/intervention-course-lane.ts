import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {RouteDirectionRepositoryProvider} from '../../providers/repositories/route-direction-repository';
import {RouteDirection} from '../../models/route-direction';

/**
 * Generated class for the InterventionCourseLanePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intervention-course-lane',
  templateUrl: 'intervention-course-lane.html',
})
export class InterventionCourseLanePage {
  public form: FormGroup;
  public directions: RouteDirection[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public controller: InterventionControllerProvider,
    private fb: FormBuilder,
    public laneRepo: LaneRepositoryProvider,
    private directionRepo: RouteDirectionRepositoryProvider) {
    this.createForm();
    controller.courseLaneLoaded.subscribe(() => this.setValuesAndStartListening());
    controller.loadSpecificCourseLane(navParams.get('idInterventionPlanCourseLane'));
    directionRepo.getList().subscribe(data => this.directions = data);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InterventionCourseLanePage');
  }

  private createForm(): void {
    this.form = this.fb.group({
      idLane: ['', Validators.required],
      direction: [0]
    });
  }

  setValuesAndStartListening() {
    this.setValues();
    this.startWatchingForm();
  }

  private startWatchingForm() {
    this.form.valueChanges
      .debounceTime(500)
      .subscribe(() => this.saveIfValid());
  }

  private setValues() {
    if (this.controller.course != null) {
      this.form.patchValue(this.controller.courseLane);
    }
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      this.saveForm();
    }
  }

  private saveForm() {
    const formModel  = this.form.value;
    Object.assign(this.controller.courseLane, formModel);
    this.controller.saveCourseLane();
  }
}
