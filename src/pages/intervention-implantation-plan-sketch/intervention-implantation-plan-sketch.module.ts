import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionImplantationPlanSketchPage } from './intervention-implantation-plan-sketch';
import { SketchToolModule } from 'lib-sketch-tool';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    InterventionImplantationPlanSketchPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionImplantationPlanSketchPage),
    SketchToolModule,
    TranslateModule.forChild(),
  ],
})
export class InterventionImplantationPlanSketchPageModule {}
