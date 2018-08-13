import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider} from '../../providers/repositories/inspection-building-person-requiring-assistance-type-repository';
import {InspectionBuildingPersonRequiringAssistanceForList} from '../../models/inspection-building-person-requiring-assistance-for-list';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-building-pnaps',
    templateUrl: 'building-pnaps.html',
})
export class BuildingPnapsPage {

    private readonly idBuilding: string;
    private readonly name: string;

    public pnaps: InspectionBuildingPersonRequiringAssistanceForList[] = [];
    public labels = {};

    constructor(
        private load: LoadingController,
        private pnapRepo: InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider,
        private modalCtrl: ModalController,
        public navCtrl: NavController,
        public navParams: NavParams,
        private translateService: TranslateService) {

        this.idBuilding = navParams.get('idBuilding');
        this.name = navParams.get('name');
    }

    public ngOnInit() {
        this.translateService.get([
            'waitFormMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public async ionViewDidEnter() {
        await this.loadPnaps();
    }

    private async loadPnaps() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        const result = await this.pnapRepo.getList(this.idBuilding);
        this.pnaps = result;
        await loader.dismiss();
    }

    public onItemClick(idBuildingPnap: string): void {
        let modal = this.modalCtrl.create('BuildingPnapDetailPage', {
            idBuildingPnap: idBuildingPnap,
            idBuilding: this.idBuilding
        });
        modal.onDidDismiss(() => this.loadPnaps());
        modal.present();
    }
}
