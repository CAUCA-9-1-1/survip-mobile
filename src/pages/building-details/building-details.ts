import { Component } from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AllConstructionTypes, UnitOfMeasure} from '../../models/all-construction-types';
import {ConstructionTypesRepositoryProvider} from '../../providers/repositories/construction-types-repository';
import {UnitOfMeasureRepositoryProvider} from '../../providers/repositories/unit-of-measure-repository';
import {InspectionBuildingDetail} from '../../models/inspection-building-detail';
import {BuildingDetailRepositoryProvider} from '../../providers/repositories/building-detail-repository';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {ISubscription} from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-building-details',
  templateUrl: 'building-details.html',
})
export class BuildingDetailsPage {

  private subscription: ISubscription;

  public readonly idBuilding: string;
  public readonly name: string;
  public allTypes: AllConstructionTypes;
  public ratesUnitOfMeasure: UnitOfMeasure[];
  public dimensionUnitOfMeasure: UnitOfMeasure[];
  public detail: InspectionBuildingDetail;
  public form: FormGroup;

  constructor(
    private formBuilding: FormBuilder,
    private msg: MessageToolsProvider,
    private constructionRepo: ConstructionTypesRepositoryProvider,
    private unitOfMeasureRepo: UnitOfMeasureRepositoryProvider,
    private detailRepo: BuildingDetailRepositoryProvider,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams) {

    this.idBuilding = navParams.get('idBuilding');
    this.name = navParams.get('name');
    this.createForm();
    this.loadDataForLookups();
  }

  private loadDataForLookups() {
    this.constructionRepo.getAllTypes()
      .subscribe((types: AllConstructionTypes) => this.allTypes = types);
    this.unitOfMeasureRepo.getAllForDimension()
      .subscribe((units: UnitOfMeasure[]) => this.dimensionUnitOfMeasure = units);
    this.unitOfMeasureRepo.getAllForRate()
      .subscribe((units: UnitOfMeasure[]) => this.ratesUnitOfMeasure = units);
  }

  async ionViewDidEnter(){
    let load = this.loadingCtrl.create({'content':'Patientez...'});
    await load.present();
    this.detail = await this.detailRepo.get(this.idBuilding);
    this.setValuesAndStartListening();
    await load.dismiss();
  }

  private createForm() {
    this.form = this.formBuilding.group({
      height: [0, [Validators.min(0), Validators.max(999999)]],
      idUnitOfMeasureHeight: [0, [this.unitOfMeasureMandatoryWhenHeightIsSetValidator]],
      estimatedWaterFlow: [0, [Validators.min(0), Validators.max(999999)]],
      idUnitOfMeasureEstimatedWaterFlow: [0, [this.unitOfMeasureMandatoryWhenHeightIsSetValidator]],
      garageType: [0, [Validators.required]],
      idConstructionType: [0],
      idConstructionFireResistanceType: [0],
      idRoofType: [0],
      idRoofMaterialType: [0],
      idBuildingType: [0],
      idBuildingSidingType: [0],
    });
  }

  private unitOfMeasureMandatoryWhenHeightIsSetValidator(control: FormControl){
    if (this.detail.height > 0 && (control.value == null || control.value == ""))
      return {'missingUnitOfMeasure': true};
    return null;
  }

  private setValuesAndStartListening(): void{
    this.setValues();
    this.startWatchingForm();
  }

  private setValues(){
    if (this.detail != null)
      this.form.patchValue(this.detail);
  }

  private startWatchingForm() {
    this.subscription = this.form.valueChanges
      .debounceTime(500)
      .subscribe(() => this.saveIfValid());
  }

  private saveIfValid(){
    if (this.form.valid && this.form.dirty)
      this.saveForm();
  }

  private async saveForm() {
    const formModel = this.form.value;
    Object.assign(this.detail, formModel);
    await this.detailRepo.save(this.detail);
    this.form.markAsPristine();
  }

  ionViewDidLoad() {
  }
}
