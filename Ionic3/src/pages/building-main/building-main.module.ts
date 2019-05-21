import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingMainPage} from './building-main';
import {ComponentsModule} from '../../components/components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingMainPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingMainPage),
        ComponentsModule,
        TranslateModule.forChild(),
    ],
})
export class BuildingMainPageModule {
}
