import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingHazardousMaterialDetailPage} from './building-hazardous-material-detail';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingHazardousMaterialDetailPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingHazardousMaterialDetailPage),
        TranslateModule.forChild()
    ],
})
export class BuildingHazardousMaterialDetailPageModule {
}
