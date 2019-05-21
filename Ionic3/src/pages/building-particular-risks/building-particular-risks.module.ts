import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {BuildingParticularRisksPage} from './building-particular-risks';
import {ComponentsModule} from '../../components/components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        BuildingParticularRisksPage,
    ],
    imports: [
        IonicPageModule.forChild(BuildingParticularRisksPage),
        ComponentsModule,
        TranslateModule.forChild(),
    ],
})
export class BuildingParticularRisksPageModule {
}
