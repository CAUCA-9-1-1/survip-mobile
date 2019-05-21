import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InterventionCoursePage} from './intervention-course';
import {ComponentsModule} from '../../components/components.module';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        InterventionCoursePage
    ],
    imports: [
        IonicPageModule.forChild(InterventionCoursePage),
        ComponentsModule,
        PipesModule,
        TranslateModule.forChild()
    ],
    exports: [
        InterventionCoursePage
    ]
})
export class InterventionCoursePageModule {
}
