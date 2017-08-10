import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionImplantationPlanPage } from './intervention-implantation-plan';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    InterventionImplantationPlanPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(InterventionImplantationPlanPage),
  ],
})
export class InterventionImplantationPlanPageModule {}
