import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingDetailsPage} from './building-details';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingDetailsPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingDetailsPage),
        PipesModule,
        TranslateModule.forChild()
    ],
})
export class BuildingDetailsPageModule {
}
