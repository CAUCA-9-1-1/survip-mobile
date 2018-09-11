import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ISubscription} from 'rxjs/Subscription';
import {InspectionBuildingSprinkler} from '../../models/inspection-building-sprinkler';
import {MessageToolsProvider} from '../../providers/message-tools/message-tools';
import {InspectionBuildingSprinklerRepositoryProvider} from '../../providers/repositories/inspection-building-sprinkler-repository-provider.service';
import {UUID} from 'angular2-uuid';
import {StaticListRepositoryProvider} from '../../providers/static-list-repository/static-list-repository';
import {GenericType} from '../../models/generic-type';
import {SprinklerTypeRepository} from '../../providers/repositories/sprinkler-type-repository.service';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-building-water-sprinklers',
    templateUrl: 'building-water-sprinklers.html',
})
export class BuildingWaterSprinklersPage {

    private idBuildingSprinkler: string;
    private readonly idBuilding: string;
    private subscription: ISubscription;

    public isNew: boolean = false;
    public sprinkler: InspectionBuildingSprinkler;
    public types: GenericType[] = [];
    public form: FormGroup;
    public walls: string[] = [];
    public sectors: string[] = [];
    public labels = {};

    constructor(
        private staticRepo: StaticListRepositoryProvider,
        private fb: FormBuilder,
        private loadCtrl: LoadingController,
        private typeRepo: SprinklerTypeRepository,
        private repo: InspectionBuildingSprinklerRepositoryProvider,
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
        this.idBuildingSprinkler = navParams.get('idBuildingSprinkler');
        this.isNew = this.idBuildingSprinkler == null;
        this.createForm();
    }

    public ngOnInit() {
        this.translateService.get([
            'confirmation', 'waitFormMessage', 'fireSprinklerLeaveMessage', 'fireSprinklerDeleteQuestion'
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
          if (this.idBuildingSprinkler == null) {
            this.createSprinkler();
          }
          else {
            const data = await this.repo.get(this.idBuildingSprinkler);
            this.sprinkler = data;
          }
          this.setValuesAndStartListening();
        } finally {
          await load.dismiss();
        }
    }

    private createForm() {
        this.form = this.fb.group({
            idSprinklerType: ['', [Validators.required]],
            floor: ['', [Validators.maxLength(100)]],
            wall: ['', [Validators.maxLength(100)]],
            sector: ['', [Validators.maxLength(100)]],
            pipeLocation: ['', [Validators.maxLength(500)]],
            collectorLocation: ['', [Validators.maxLength(500)]]
        });
    }

    private setValuesAndStartListening(): void {
        this.setValues();
        this.startWatchingForm();
    }

    private setValues() {
        if (this.sprinkler != null) {
            this.form.patchValue(this.sprinkler);
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
        Object.assign(this.sprinkler, formModel);
        await this.repo.save(this.sprinkler);
        this.form.markAsPristine();
        this.isNew = false;
    }

    private createSprinkler() {
        let data = new InspectionBuildingSprinkler();
        data.id = UUID.UUID();
        data.idBuilding = this.idBuilding;
        this.idBuildingSprinkler = data.id;
        this.sprinkler = data;
    }

    public async onDeleteSprinkler() {
        if (!this.isNew && await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['fireSprinklerDeleteQuestion'])) {
            await this.repo.delete(this.idBuildingSprinkler);
            this.viewCtrl.dismiss();
        }
        else if (this.isNew) {
            this.viewCtrl.dismiss();
        }
    }

    public async onCancelEdition() {
        if (this.form.dirty || this.isNew) {
            if (await this.msg.ShowMessageBox(this.labels['confirmation'], this.labels['fireSprinklerLeaveMessage']))
                this.viewCtrl.dismiss();
        }
        else
            this.viewCtrl.dismiss();
    }
}
