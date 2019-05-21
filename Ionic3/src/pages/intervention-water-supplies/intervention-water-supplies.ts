import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InterventionFormFireHydrantRepositoryProvider} from '../../providers/repositories/intervention-form-fire-hydrant-repository';
import {InspectionBuildingFireHydrantForLIst} from '../../models/intervention-form-fire-hydrant-for-list';
import {InterventionControllerProvider} from '../../providers/intervention-controller/intervention-controller';
import {InterventionForm} from '../../models/intervention-form';
import {InspectionBuildingFireHydrantForList} from '../../models/inspection-building-fire-hydrant-for-list';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {InspectionBuildingFireHydrantRepositoryProvider} from '../../providers/repositories/inspection-building-fire-hydrant-repository-provider';
import {CityFireHydrantPage} from "../city-fire-hydrant/city-fire-hydrant";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
import {Inspection} from "../../interfaces/inspection.interface";

@IonicPage()
@Component({
    selector: 'page-intervention-water-supplies',
    templateUrl: 'intervention-water-supplies.html',
})
export class InterventionWaterSuppliesPage {

  public get currentInspection(): Inspection {
    return this.controller.currentInspection;
  }


    public fireHydrants: InspectionBuildingFireHydrantForList[] = [];
    public labels = {};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private controller: InspectionControllerProvider,
                private hydrantRepo: InspectionBuildingFireHydrantRepositoryProvider,
                private messageTools: MessageToolsProvider,
                private translateService: TranslateService,
    ) {
    }

    public ionViewDidEnter(){
        this.loadBuildingFireHydrant();
    }

    public ngOnInit() {
        this.translateService.get([
            'fireHydrantDelete', 'fireHydrantDeleteQuestion'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    private loadBuildingFireHydrant() {
      this.hydrantRepo.getList(this.controller.getMainBuilding().idBuilding)
        .then(hydrants => this.fireHydrants = hydrants);
    }

    public async onDeleteFireHydrant(idFireHydrant: string) {
        let canDelete = await this.messageTools.ShowMessageBox(this.labels['fireHydrantDelete'], this.labels['fireHydrantDeleteQuestion']);
        if (canDelete) {
            await this.hydrantRepo.deleteFireHydrant(this.controller.getMainBuilding().idBuilding, idFireHydrant);
            this.loadBuildingFireHydrant();
        }
    }

    public onItemClick(idCity: string) {
        this.navCtrl.push('CityFireHydrantPage', {idCity: idCity, idBuilding: this.controller.getMainBuilding().idBuilding});
    }

    /* Do not delete, this will be used once we make the fire hydrant's page work in offline mode.
    public goToFireHydrantDetail(idFireHydrant: string){
        this.navCtrl.push('FireHydrantPage', {idCity: this.currentInspection.idCity, id: idFireHydrant});
    }*/
}
