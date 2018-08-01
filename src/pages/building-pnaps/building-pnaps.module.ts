import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingPnapsPage} from './building-pnaps';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingPnapsPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingPnapsPage),
        PipesModule,
        TranslateModule.forChild()
    ],
})
export class BuildingPnapsPageModule {
}
