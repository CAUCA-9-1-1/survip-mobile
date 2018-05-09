import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {ISubscription} from 'rxjs/Subscription';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {InspectionBuildingPersonRequiringAssistance} from '../../models/inspection-building-person-requiring-assistance';
import {GenericType} from '../../models/generic-type';
import {PersonRequiringAssistanceTypeRepositoryProvider} from '../../providers/repositories/person-requiring-assistance-type-repository';
import {InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider} from '../../providers/repositories/inspection-building-person-requiring-assistance-type-repository';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {UUID} from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-building-pnap-detail',
  templateUrl: 'building-pnap-detail.html',
})
export class BuildingPnapDetailPage {

  private isNew: boolean = false;
  private idBuildingPnap: string;
  private readonly idBuilding: string;
  private subscription: ISubscription;
  private readonly integerPattern: string = "^(0|([1-9]([0-9]*)))$";
  private readonly decimalPattern: string = "^[0-9]+(.[0-9]{1,2})?$";

  public pnap: InspectionBuildingPersonRequiringAssistance;
  public form: FormGroup;
  public pnapTypes: GenericType[] = [];

  constructor(
    private fb: FormBuilder,
    private loadCtrl: LoadingController,
    private msg: MessageToolsProvider,
    private viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private typeRepo: PersonRequiringAssistanceTypeRepositoryProvider,
    private repo: InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.idBuilding = navParams.get("idBuilding");
    this.idBuildingPnap = navParams.get('idBuildingPnap');
    this.typeRepo.getAll()
      .subscribe(data => this.pnapTypes = data);
    this.createForm();
  }

  async ionViewDidLoad() {
    let load = this.loadCtrl.create({'content': 'Patientez...'});
    await load.present();
    if (this.idBuildingPnap == null)
      this.createPnap();
    else
      this.pnap = await this.repo.get(this.idBuildingPnap);

    this.setValuesAndStartListening();
    await load.dismiss();
  }

  private createForm() {
    let regexChecker = (mask: string) =>
    {
      return (control: FormControl) => {
        var value = control.value + "";
        const reg = new RegExp(mask);
        if (reg.test(value))
          return null;
        else
          return {'incorrectValue': true};
      };
    };

    this.form = this.fb.group({
      idPersonRequiringAssistanceType: ['', [Validators.required]],
      dayResidentCount: [0, [Validators.min(0), Validators.max(9999), regexChecker(this.integerPattern)]],
      eveningResidentCount: [0, [Validators.min(0), Validators.max(9999), regexChecker(this.integerPattern)]],
      nightResidentCount: [0, [Validators.min(0), Validators.max(9999), regexChecker(this.integerPattern)]],
      dayIsApproximate: [false, []],
      eveningIsApproximate: [false, []],
      nightIsApproximate: [false, []],

      description: ['', [Validators.maxLength(500)]],
      personName: ['', [Validators.maxLength(60)]],
      floor: ['', [Validators.maxLength(3)]],
      local: ['', [Validators.maxLength(10)]],
      contactName: ['', [Validators.maxLength(60)]],
      contactPhoneNumberMasked: ['', [Validators.maxLength(10), Validators.pattern('[0-9]+')]],
    });
  }

  private setNumber(fieldName: string, newNumber: string): void{
    this.form.controls[fieldName].patchValue(newNumber, {emitEvent: false});
  }

  private formatPhoneNumber(phone: string) : string {
    let area = "";
    let firstThree = "";
    let lastFour = "";
    var result = "(";

    if (phone.length == 0)
      return "";
    else if (phone.length < 3)
      return result + phone;
    else
      area += phone.substr(0, 3);

    if (phone.length > 3 && phone.length < 6)
      firstThree = phone.substr(3, phone.length -3);
    else if (phone.length > 3)
      firstThree = phone.substr(3, 3);

    if (phone.length > 6 && phone.length < 10)
      lastFour = phone.substr(6, phone.length - 6);
    else if (phone.length > 6)
      lastFour = phone.substr(6, 4);

    result += area;
    if (area.length == 3)
      result += ") ";

    if (firstThree.length < 3)
      return result + firstThree;
    else
      return result + firstThree + '-' + lastFour;
  }


  private setValuesAndStartListening(): void{
    this.setValues();
    this.startWatchingForm();
  }

  private setValues() {
    if (this.pnap != null) {
      this.form.patchValue(this.pnap);
      this.setNumber('contactPhoneNumberMasked', this.formatPhoneNumber(this.pnap.contactPhoneNumber));
    }
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
    Object.assign(this.pnap, this.form.value);
    this.pnap.contactPhoneNumber = this.form.value.contactPhoneNumberMasked.replace(/\D+/g, "")
    await this.repo.save(this.pnap);
    this.form.markAsPristine();
    this.isNew = false;
  }

  private createPnap() {
    this.isNew = true;
    let data =  new InspectionBuildingPersonRequiringAssistance();
    data.id = UUID.UUID();
    data.idBuilding = this.idBuilding;
    this.idBuildingPnap = data.id;
    this.pnap = data;
  }

  public async onDeletePnap() {
    if (!this.isNew && await this.msg.ShowMessageBox("Confirmation de suppression", "Êtes-vous certain de vouloir supprimer ce PNAP?")) {
      await this.repo.delete(this.idBuildingPnap);
      await this.viewCtrl.dismiss();
    }
    else if (this.isNew) {
      await this.viewCtrl.dismiss();
    }
  }

  public async onCancelEdition() {
    if (this.form.dirty || this.isNew) {
      if (await this.msg.ShowMessageBox("Confirmation", "Le PNAP contient des erreurs de validation et n'a pas été sauvegardée.  Voulez-vous quand même retourner à la page des PNAPs du bâtiment?"))
        await this.viewCtrl.dismiss();
    }
    else
      await this.viewCtrl.dismiss();
  }
}
