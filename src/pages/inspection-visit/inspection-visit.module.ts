import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionVisitPage } from './inspection-visit';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InspectionVisitPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionVisitPage),
      TranslateModule.forChild()
  ],
})
export class InspectionVisitPageModule {}
