import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionQuestionSummaryPage } from './inspection-question-summary';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    InspectionQuestionSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionQuestionSummaryPage),
      ComponentsModule,
      PipesModule,
  ],
})
export class InspectionQuestionSummaryPageModule {}
