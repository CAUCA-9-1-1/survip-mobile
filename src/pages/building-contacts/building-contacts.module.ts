import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingContactsPage} from './building-contacts';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingContactsPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingContactsPage),
        PipesModule,
        TranslateModule.forChild()
    ],
})
export class BuildingContactsPageModule {
}
