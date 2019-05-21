import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingAlarmPanelsPage} from './building-alarm-panels';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingAlarmPanelsPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingAlarmPanelsPage),
        PipesModule,
        TranslateModule.forChild(),
    ],
})
export class BuildingAlarmPanelsPageModule {
}
