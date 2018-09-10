import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';
import {InspectionBuildingAlarmPanel} from '../../models/inspection-building-alarm-panel';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {InspectionBuildingAlarmPanelRepositoryProvider} from '../../providers/repositories/inspection-building-alarm-panel-repository-provider.service';
import {UUID} from 'angular2-uuid';
import {StaticListRepositoryProvider} from '../../providers/static-list-repository/static-list-repository';
import {GenericType} from '../../models/generic-type';
import {AlarmPanelTypeRepository} from '../../providers/repositories/alarm-panel-type-repository.service';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-building-alarm-panels',
    templateUrl: 'building-alarm-panels.html',
})
export class BuildingAlarmPanelsPage {

    private idBuildingAlarmPanel: string;
    private readonly idBuilding: string;
    private subscription: ISubscription;

    public isNew: boolean = false;
    public panel: InspectionBuildingAlarmPanel;
    public types: GenericType[] = [];
    public form: FormGroup;
    public walls: string[] = [];
    public sectors: string[] = [];
    public labels = {};

    constructor(
        private typeRepo: AlarmPanelTypeRepository,
        private fb: FormBuilder,
        private loadCtrl: LoadingController,
        private staticRepo: StaticListRepositoryProvider,
        private repo: InspectionBuildingAlarmPanelRepositoryProvider,
        private msg: MessageToolsProvider,
        public navCtrl: NavController,
        public viewCtrl: ViewController,
        public navParams: NavParams,
        private translateService: TranslateService) {

        typeRepo.getAll()
            .subscribe(data => this.types = data);
        this.walls = staticRepo.getWallList();
        this.sectors = staticRepo.getSectorList();
        this.idBuilding = navParams.get("idBuilding");
        this.idBuildingAlarmPanel = navParams.get('idBuildingAlarmPanel');
        this.isNew = this.idBuildingAlarmPanel == null;
        this.createForm();
    }

    public ngOnInit() {
        this.translateService.get([
            'confirmation', 'waitFormMessage', 'fireAlarmPanelDeleteQuestion', 'fireAlarmPanelLeaveMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public async ionViewDidEnter() {
        let load = this.loadCtrl.create({'content': this.labels['waitFormMessage']});
        await load.present();
        try {
          if (this.idBuildingAlarmPanel == null) {
            this.createAlarmPanel();
          }
          else {
            const data = await this.repo.get(this.idBuildingAlarmPanel);
            this.panel = data;
          }
          this.setValuesAndStartListening();
        } finally {
          await load.dismiss();
        }
    }

    private createForm() {
        this.form = this.fb.group({
            idAlarmPanelType: ['', [Validators.required]],
            floor: ['', [Validators.maxLength(100)]],
            wall: ['', [Validators.maxLength(100)]],
            sector: ['', [Validators.maxLength(100)]]
        });
    }

    private setValuesAndStartListening(): void {
        this.setValues();
        this.startWatchingForm();
    }

    private setValues() {
        if (this.panel != null) {
            this.form.patchValue(this.panel);
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
        Object.assign(this.panel, formModel);
        await this.repo.save(this.panel);
        this.form.markAsPristine();
        this.isNew = false;
    }

    private createAlarmPanel() {
        let data = new InspectionBuildingAlarmPanel();
        data.id = UUID.UUID();
        data.idBuilding = this.idBuilding;
        this.idBuildingAlarmPanel = data.id;
        this.panel = data;
    }

    public async onDeleteAlarmPanel() {
        if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['fireAlarmPanelDeleteQuestion'])) {
            await this.repo.delete(this.idBuildingAlarmPanel);
            this.viewCtrl.dismiss();
        }
        else if (this.isNew) {
            this.viewCtrl.dismiss();
        }
    }

    public async onCancelEdition() {
        if (this.form.dirty || this.isNew) {
            if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['fireAlarmPanelLeaveMessage']))
                this.viewCtrl.dismiss();
        }
        else
            this.viewCtrl.dismiss();
    }
}
