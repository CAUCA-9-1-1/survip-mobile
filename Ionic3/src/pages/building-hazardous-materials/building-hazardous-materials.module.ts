import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingHazardousMaterialsPage} from './building-hazardous-materials';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingHazardousMaterialsPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingHazardousMaterialsPage),
        PipesModule,
        TranslateModule.forChild()
    ],
})
export class BuildingHazardousMaterialsPageModule {
}
