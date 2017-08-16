import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionCourseLanePage } from './intervention-course-lane';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    InterventionCourseLanePage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionCourseLanePage),
    ComponentsModule
  ],
})
export class InterventionCourseLanePageModule {}
