import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionCoursePage } from './intervention-course';
import {ComponentsModule} from '../../components/components.module';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    InterventionCoursePage
  ],
  imports: [
    IonicPageModule.forChild(InterventionCoursePage),
    ComponentsModule,
    PipesModule,
  ],
  exports: [
    InterventionCoursePage
  ]
})
export class InterventionCoursePageModule {}
