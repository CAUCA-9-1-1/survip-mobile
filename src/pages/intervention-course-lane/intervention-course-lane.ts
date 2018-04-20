import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LaneRepositoryProvider} from '../../providers/repositories/lane-repository';
import {RouteDirectionRepositoryProvider} from '../../providers/repositories/route-direction-repository';
import {RouteDirection} from '../../models/route-direction';
import {AuthenticationService} from '../../providers/Base/authentification.service';

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
    private authService: AuthenticationService,
    public controller: InterventionControllerProvider,
    private fb: FormBuilder,
    public laneRepo: LaneRepositoryProvider,
    private alertCtrl: AlertController,
    private directionRepo: RouteDirectionRepositoryProvider) {
    this.createForm();
    controller.courseLaneLoaded.subscribe(() => this.setValuesAndStartListening());
    controller.loadSpecificCourseLane(navParams.get('idInterventionFormCourseLane'));
    directionRepo.getList().subscribe(data => this.directions = data);
  }

  ionViewDidLoad() {
  }

  async ionViewCanEnter() {
    let isLoggedIn = await this.authService.isStillLoggedIn();
    if (!isLoggedIn)
      this.redirectToLoginPage();
  }

  private redirectToLoginPage(){
    this.navCtrl.setRoot('LoginPage');
  }

  ionViewCanLeave() {
    if (this.form.dirty || !this.form.valid) {
      return new Promise((resolve, rejeect) => {
        let alert = this.alertCtrl.create({
          title: 'Confirmation',
          message: "La voie contient des erreurs de validation et n'a pas été sauvegardée.  Voulez-vous quand même retourner à la page du parcours?",
          buttons: [
            {text: 'Non', handler: () => { resolve(false); }},
            {text: 'Oui', handler: () => { resolve(true); }}
          ]});

        return alert.present()
      });
    }
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
    this.form.markAsPristine();
  }

  private onDeleteLane() {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer cette voie?',
      buttons: [
        {text: 'Non', role: 'cancel'},
        {text: 'Oui', handler: () => { this.controller.deleteCourseLane().subscribe(() => this.goBack()); }}
    ]});

    alert.present();
  }

  private goBack(): void {
    this.navCtrl.pop();
  }
}
