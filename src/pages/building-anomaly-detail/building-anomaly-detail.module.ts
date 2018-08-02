import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingAnomalyDetailPage} from './building-anomaly-detail';
import {ComponentsModule} from '../../components/components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingAnomalyDetailPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(BuildingAnomalyDetailPage),
        TranslateModule.forChild(),
    ],
})
export class BuildingAnomalyDetailPageModule {
}
