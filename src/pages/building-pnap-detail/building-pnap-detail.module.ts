import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingPnapDetailPage} from './building-pnap-detail';
import {PipesModule} from '../../pipes/pipes.module';
import {BrMaskerModule} from 'brmasker-ionic-3';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingPnapDetailPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingPnapDetailPage),
        PipesModule,
        BrMaskerModule,
        TranslateModule.forChild()
    ],
})
export class BuildingPnapDetailPageModule {
}
