import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionImplantationPlanPage } from './intervention-implantation-plan';
import {ComponentsModule} from '../../components/components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InterventionImplantationPlanPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(InterventionImplantationPlanPage),
      TranslateModule.forChild()
  ],
})
export class InterventionImplantationPlanPageModule {}
