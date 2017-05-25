import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionCoursePage } from './intervention-course';

@NgModule({
  declarations: [
    InterventionCoursePage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionCoursePage),
  ],
  exports: [
    InterventionCoursePage
  ]
})
export class InterventionCoursePageModule {}
