import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionSurveySummaryPage } from './inspection-survey-summary';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InspectionSurveySummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionSurveySummaryPage),
      ComponentsModule,
      PipesModule,
      TranslateModule.forChild(),
  ],
})
export class InspectionSurveySummaryPageModule {}
