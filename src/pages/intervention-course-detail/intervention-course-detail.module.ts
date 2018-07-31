import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {InterventionCourseDetailPage} from './intervention-course-detail';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        InterventionCourseDetailPage
    ],
    imports: [
        IonicPageModule.forChild(InterventionCourseDetailPage),
        PipesModule,
        TranslateModule.forChild()
    ],
})
export class InterventionCourseDetailPageModule {
}
