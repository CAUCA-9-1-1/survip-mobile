import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InspectionsPage} from './inspections';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        InspectionsPage
    ],
    imports: [
        IonicPageModule.forChild(InspectionsPage),
        TranslateModule.forChild(),
    ],
    exports: [
        InspectionsPage
    ],
    providers: []
})
export class InspectionsPageModule {
}
