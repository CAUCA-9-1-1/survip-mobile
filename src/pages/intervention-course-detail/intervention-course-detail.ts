import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, reorderArray} from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-intervention-course-detail',
  templateUrl: 'intervention-course-detail.html',
})
export class InterventionCourseDetailPage {
  public form: FormGroup;
  public changeOrder: Boolean = false;

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

  public onChangeOrder(): void {
      this.changeOrder = !this.changeOrder;
  }

  public onReorderLane(indexes){
      this.controller.courseLanes = reorderArray(this.controller.courseLanes, indexes);
      this.controller.setLanesSequenceAndSave();
      console.log(JSON.stringify(this.controller.courseLanes));
  }

  public onClickLane(idInterventionPlanCourseLane: string): void {
    console.log('test');
  }
}
