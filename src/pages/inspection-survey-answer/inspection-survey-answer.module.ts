import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionSurveyAnswerPage } from './inspection-survey-answer';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
      InspectionSurveyAnswerPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionSurveyAnswerPage),
      ComponentsModule,
      PipesModule,
      TranslateModule.forChild(),
  ],
})
export class InspectionSurveyAnswerPageModule {}
