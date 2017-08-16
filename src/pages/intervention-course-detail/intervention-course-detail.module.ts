import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionCourseDetailPage } from './intervention-course-detail';

@NgModule({
  declarations: [
    InterventionCourseDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionCourseDetailPage),
  ],
})
export class InterventionCourseDetailPageModule {}
