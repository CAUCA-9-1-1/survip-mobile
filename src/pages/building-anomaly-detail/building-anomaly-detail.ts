import { Component } from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';
import {InspectionBuildingAnomaly} from '../../models/inspection-building-anomaly';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {InspectionBuildingAnomalyRepositoryProvider} from '../../providers/repositories/inspection-building-anomaly-repository-provider.service';
import {InspectionBuildingAnomalyPictureRepositoryProvider} from '../../providers/repositories/inspection-building-anomaly-picture-repository-provider.service';
import {UUID} from 'angular2-uuid';

@IonicPage()
@Component({
  selector: 'page-building-anomaly-detail',
  templateUrl: 'building-anomaly-detail.html',
})
export class BuildingAnomalyDetailPage {

  private isNew: boolean = false;
  private idBuildingAnomaly: string;
  private readonly idBuilding: string;
  private subscription: ISubscription;
  private readonly selectedTheme: string;

  public anomaly: InspectionBuildingAnomaly;
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private repo: InspectionBuildingAnomalyRepositoryProvider,
    public picRepo: InspectionBuildingAnomalyPictureRepositoryProvider,
    private msg: MessageToolsProvider,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

    this.idBuilding = navParams.get("idBuilding");
    this.idBuildingAnomaly = navParams.get('idBuildingAnomaly');
    this.selectedTheme = navParams.get('theme');
    this.createForm();
  }

  ionViewDidLoad() {
  }

  async ionViewDidEnter(){
    let load = this.loadCtrl.create({'content': 'Patientez...'});
    await load.present();
    if (this.idBuildingAnomaly == null)
      this.createAnomaly();
    else
      this.anomaly = await this.repo.get(this.idBuildingAnomaly);

    this.setValuesAndStartListening();
    await load.dismiss();
  }

  private createForm() {
    this.form = this.fb.group({
      id: [''],
      theme: ['', [Validators.required, Validators.maxLength(50)]],
      notes: ['', [Validators.maxLength(500)]],
    });
  }

  private setValuesAndStartListening(): void{
    this.setValues();
    this.startWatchingForm();
  }

  private setValues() {
    if (this.anomaly != null) {
      this.form.patchValue(this.anomaly);
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
    const formModel = this.form.value;
    Object.assign(this.anomaly, formModel);
    await this.repo.save(this.anomaly);
    this.form.markAsPristine();
    this.isNew = false;
  }

  private createAnomaly() {
    this.isNew = true;
    let data =  new InspectionBuildingAnomaly();
    data.notes = "";
    data.id = UUID.UUID();
    data.theme = this.selectedTheme;
    data.idBuilding = this.idBuilding;
    this.idBuildingAnomaly = data.id;
    this.anomaly = data;
    this.repo.save(this.anomaly);
  }

  public async onDeleteAnomaly() {
    if (!this.isNew && await this.msg.ShowMessageBox("Confirmation de suppression", "Êtes-vous certain de vouloir supprimer cette anomalie?")) {
      await this.repo.delete(this.idBuildingAnomaly);
      this.viewCtrl.dismiss();
    }
    else if (this.isNew) {
      this.viewCtrl.dismiss();
    }
  }

  public async onCancelEdition() {
    if (this.form.dirty || this.isNew) {
      if (await this.msg.ShowMessageBox("Confirmation", "L'anomalie contient des erreurs de validation et n'a pas été sauvegardée.  Voulez-vous quand même retourner à la page des anomalies du bâtiment?"))
        this.viewCtrl.dismiss();
    }
    else
      this.viewCtrl.dismiss();
  }

  public onSelectAnomaly() {
    let matModal = this.modalCtrl.create('AnomalyThemeSelectionPage');
    matModal.onDidDismiss(data => {
      if (data.hasSelected) {
        this.form.markAsDirty();
        this.form.controls['theme'].setValue(data.selectedTheme);
        this.anomaly.theme = data.selectedTheme;
        this.saveIfValid();
      }
    });
    matModal.present();
  }

  public getAllErrors(form: FormGroup): { [key: string]: any; } | null {
    let hasError = false;
    const result = Object.keys(form.controls).reduce((acc, key) => {
      const control = form.get(key);
      const errors = (control instanceof FormGroup)
        ? this.getAllErrors(control)
        : control.errors;
      if (errors) {
        acc[key] = errors;
        hasError = true;
      }
      return acc;
    }, {} as { [key: string]: any; });
    return hasError ? result : null;
  }
}
