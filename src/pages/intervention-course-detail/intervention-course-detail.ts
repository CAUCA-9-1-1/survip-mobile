import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InterventionPlanCourse} from '../../models/intervention-plan-course';

/**
 * Generated class for the InterventionCourseDetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intervention-course-detail',
  templateUrl: 'intervention-course-detail.html',
})
export class InterventionCourseDetailPage {
  public form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public controller: InterventionControllerProvider,
    private fb: FormBuilder){
    this.createForm();
    controller.courseLoaded.subscribe(() => this.setValuesAndStartListening());
    controller.loadFirestations();
    controller.loadSpecificCourse(navParams.get('idInterventionPlanCourse'));
  }

  ionViewDidLoad() {
  }

  private createForm() {
    this.form = this.fb.group({idFirestation: ['', Validators.required]});
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
      this.form.patchValue(this.controller.course);
    }
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      this.saveForm();
    }
  }

  private saveForm() {
    const formModel  = this.form.value;
    Object.assign(this.controller.course, formModel);
    this.controller.saveCourse();
  }

  public onClickLane(idInterventionPlanCourseLane: string): void {
    console.log('test');
  }
}
