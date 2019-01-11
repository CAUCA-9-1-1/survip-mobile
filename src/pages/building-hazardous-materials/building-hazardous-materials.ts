import {Component} from '@angular/core';
import {IonicPage, LoadingController, ModalController, NavController, NavParams} from 'ionic-angular';
import {InspectionBuildingHazardousMaterialForList} from '../../models/inspection-building-hazardous-material-for-list';
import {InspectionBuildingHazardousMaterialRepositoryProvider} from '../../providers/repositories/inspection-building-hazardous-material-repository';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-building-hazardous-materials',
    templateUrl: 'building-hazardous-materials.html',
})
export class BuildingHazardousMaterialsPage {

    private readonly idBuilding: string;
    private readonly name: string;

    public hazardousMaterials: InspectionBuildingHazardousMaterialForList[] = [];
    public labels = {};

    constructor(
        private load: LoadingController,
        private matRepo: InspectionBuildingHazardousMaterialRepositoryProvider,
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
        await this.loadMaterialList();
    }

    private async loadMaterialList() {
        let loader = this.load.create({content: this.labels['waitFormMessage']});
        try {
          this.hazardousMaterials = await this.matRepo.getList(this.idBuilding);
        } finally {
          await loader.dismiss();
        }
    }

    public onItemClick(material: InspectionBuildingHazardousMaterialForList): void {
        let modal = this.modalCtrl.create('BuildingHazardousMaterialDetailPage', {
            material: material,
            idBuilding: this.idBuilding
        });
        modal.onDidDismiss(() => this.loadMaterialList());
        modal.present();
    }
}
