import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {BuildingContactRepositoryProvider} from '../../providers/repositories/building-contact-repository';
import {InspectionBuildingContact} from '../../models/inspection-building-contact';
import {UUID} from 'angular2-uuid';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';

/**
 * Generated class for the BuildingContactDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-building-contact-detail',
  templateUrl: 'building-contact-detail.html',
})
export class BuildingContactDetailPage {
  private idBuildingContact: string;
  private readonly idBuilding: string;
  private subscription: ISubscription;

  public contact: InspectionBuildingContact;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private repo: BuildingContactRepositoryProvider,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

    this.idBuilding = navParams.get("idBuilding");
    this.idBuildingContact = navParams.get('idBuildingContact');
    this.createForm();
  }

  async ionViewDidEnter(){
    let load = this.loadCtrl.create({'content': 'Patientez...'});
    await load.present();
    if (this.idBuilding == null){
      this.createContact();
    }
    else {
      const data = await this.repo.get(this.idBuildingContact);
      this.contact = data;
    }
    this.setValuesAndStartListening();
    await load.dismiss();
  }

  ionViewDidLoad() {
  }

  private createForm() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      callPriority: [0, [Validators.required, Validators.pattern('[0-9]+')]],
      phoneNumber: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      phoneNumberExtension: ['',[Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      pagerNumber: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      pagerCode: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      cellphoneNumber: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      otherNumber: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      otherNumberExtension: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      isOwner: [false, Validators.required],
    });
  }

  private setValuesAndStartListening(): void{
    this.setValues();
    this.startWatchingForm();
  }

  private setValues() {
    if (this.contact != null)
      this.form.patchValue(this.contact);
  }

  private startWatchingForm() {
    this.subscription = this.form.valueChanges
      .debounceTime(500)
      .subscribe(() => this.saveIfValid());
  }

  private saveIfValid() {
    if (this.form.valid && this.form.dirty)
      this.saveForm();
  }

  private async saveForm() {
    const formModel = this.form.value;
    Object.assign(this.contact, formModel);
    await this.repo.save(this.contact);
  }

  private createContact() {
    let data =  new InspectionBuildingContact();
    data.id = UUID.UUID();
    data.idBuilding = this.idBuilding;
    this.idBuildingContact = data.id;
    this.contact = data;
  }
}
