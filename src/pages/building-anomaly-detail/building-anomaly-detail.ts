import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';
import {InspectionBuildingAnomaly} from '../../models/inspection-building-anomaly';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {InspectionBuildingAnomalyRepositoryProvider} from '../../providers/repositories/inspection-building-anomaly-repository-provider.service';
import {InspectionBuildingAnomalyPictureRepositoryProvider} from '../../providers/repositories/inspection-building-anomaly-picture-repository-provider.service';
import {UUID} from 'angular2-uuid';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-building-anomaly-detail',
    templateUrl: 'building-anomaly-detail.html',
})
export class BuildingAnomalyDetailPage {

    private subscription: ISubscription;
    private pictureSubscriber: ISubscription;

    public isNew: boolean = false;
    public anomaly: InspectionBuildingAnomaly = new InspectionBuildingAnomaly();
    public form: FormGroup;
    public labels = {};

    constructor(
        private fb: FormBuilder,
        private modalCtrl: ModalController,
        private loadCtrl: LoadingController,
        private repo: InspectionBuildingAnomalyRepositoryProvider,
        public picRepo: InspectionBuildingAnomalyPictureRepositoryProvider,
        private msg: MessageToolsProvider,
        public navCtrl: NavController,
        public viewCtrl: ViewController,
        public navParams: NavParams,
        private translateService: TranslateService) {

        this.anomaly = new InspectionBuildingAnomaly();
        this.isNew = navParams.get('idBuildingAnomaly') == null;
        this.anomaly.id = navParams.get('idBuildingAnomaly') ? navParams.get('idBuildingAnomaly') :UUID.UUID();
        this.anomaly.theme = navParams.get('theme');
        this.anomaly.idBuilding = navParams.get("idBuilding");
        this.anomaly.isActive = true;
        this.initiateForm();

        this.pictureSubscriber = this.picRepo.picturesChanged.subscribe(() => this.picturesUpdated());
    }

    public ngOnInit() {
        this.translateService.get([
            'waitFormMessage', 'confirmation', 'anomalyDeleteQuestion', 'anomalyLeaveMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public async ionViewDidLoad() {
      let load = this.loadCtrl.create({'content': this.labels['waitFormMessage']});
      await load.present();
      try {
        await this.loadBuildingAnomaly();
      } finally {
        await load.dismiss();
      }
    }

    private async loadBuildingAnomaly(){
        if (!this.isNew) {
            this.anomaly = await this.repo.get(this.anomaly.id);
            this.initiateForm();
        }
        this.startWatchingForm();
    }

    private initiateForm() {
        this.form = this.fb.group({
            id: [this.anomaly.id],
            theme: [this.anomaly.theme, [Validators.required, Validators.maxLength(50)]],
            notes: [this.anomaly.notes ? this.anomaly.notes : '', [Validators.required,Validators.maxLength(500)]],
            idBuilding:[this.anomaly.idBuilding]
        });
    }

    private startWatchingForm() {
        if(this.subscription){
            this.subscription.unsubscribe();
        }
        this.subscription = this.form.valueChanges
            .debounceTime(500)
            .subscribe(() => this.saveIfValid());
    }

    private saveIfValid() {
        if (this.form.valid && this.form.dirty) {
            this.saveForm();
        }
    }

    private async saveForm() {
        Object.assign(this.anomaly, this.form.value);
        await this.repo.save(this.anomaly)
            .then(()=>{
                this.form.markAsPristine();
                this.isNew = false;
                this.picRepo.saveAll();
        })
            .catch(error =>{
                console.log("Error in saveForm", error);
            });

    }

    public async onDeleteAnomaly() {
        if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['anomalyDeleteQuestion'])) {
            await this.repo.delete(this.anomaly.id);
            this.viewCtrl.dismiss();
            this.unSubscribeEvent();
        }
        else if (this.isNew) {
            this.viewCtrl.dismiss();
            this.unSubscribeEvent();
        }
    }

    public async onCancelEdition() {
        if (this.form.dirty || this.isNew) {
            if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['anomalyLeaveMessage'])) {
                this.viewCtrl.dismiss();
                this.unSubscribeEvent();
            }
        }
        else {
            this.viewCtrl.dismiss();
            this.unSubscribeEvent();
        }
    }

    public onSelectAnomaly() {
        let matModal = this.modalCtrl.create('AnomalyThemeSelectionPage');
        matModal.onDidDismiss(data => {
            if (data.hasSelected) {
                this.form.markAsDirty();
                this.form.controls['theme'].patchValue(data.selectedTheme);
            }
        });
        matModal.present();
    }

    private picturesUpdated(){
        this.form.markAsDirty();
        this.form.updateValueAndValidity();
    }

    public unSubscribeEvent(){
        this.subscription.unsubscribe();
        this.pictureSubscriber.unsubscribe();
    }

    public ngOnDestroy(){
        this.unSubscribeEvent();
    }
}
