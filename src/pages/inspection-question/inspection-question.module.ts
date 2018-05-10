import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionQuestionPage } from './inspection-question';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
      InspectionQuestionPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionQuestionPage),
      ComponentsModule,
      PipesModule,
  ],
})
export class InspectionQuestionPageModule {}
