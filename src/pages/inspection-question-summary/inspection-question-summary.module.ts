import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionQuestionSummaryPage } from './inspection-question-summary';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InspectionQuestionSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionQuestionSummaryPage),
      ComponentsModule,
      PipesModule,
      TranslateModule.forChild(),
  ],
})
export class InspectionQuestionSummaryPageModule {}
