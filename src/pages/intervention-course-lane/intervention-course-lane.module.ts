import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InterventionCourseLanePage} from './intervention-course-lane';
import {ComponentsModule} from '../../components/components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        InterventionCourseLanePage,
    ],
    imports: [
        IonicPageModule.forChild(InterventionCourseLanePage),
        ComponentsModule,
        TranslateModule.forChild(),
    ],
})
export class InterventionCourseLanePageModule {
}
