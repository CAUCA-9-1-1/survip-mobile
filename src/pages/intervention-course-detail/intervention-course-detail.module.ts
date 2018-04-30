import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionCourseDetailPage } from './intervention-course-detail';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    InterventionCourseDetailPage
  ],
  imports: [
    IonicPageModule.forChild(InterventionCourseDetailPage),
    PipesModule
  ],
})
export class InterventionCourseDetailPageModule {}
