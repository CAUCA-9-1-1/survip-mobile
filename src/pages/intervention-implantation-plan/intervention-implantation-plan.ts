import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {PictureData} from '../../models/picture-data';
import {InterventionPlan} from '../../models/intervention-plan';

/**
 * Generated class for the InterventionImplantationPlanPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intervention-implantation-plan',
  templateUrl: 'intervention-implantation-plan.html',
})
export class InterventionImplantationPlanPage {
  public form: FormGroup;

  get picture(): PictureData{
    return this.controller.picture;
  }

  get plan(): InterventionPlan{
    return this.controller.interventionPlan
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private controller: InterventionControllerProvider,) {
    this.createForm();
    controller.pictureLoaded.subscribe(() => this.setValuesAndStartListening());
  }

  ionViewDidLoad() {
    this.controller.loadInterventionPlanPicture();
  }

  private createForm() {
    this.form = this.fb.group({picture: ['']});
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
    if (this.picture != null) {
      this.form.patchValue(this.picture);
    }
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty) {
      this.saveForm();
    }
  }

  private saveForm() {
    const formModel  = this.form.value;
    Object.assign(this.controller.picture, formModel);
    this.controller.savePicture();
  }
}
