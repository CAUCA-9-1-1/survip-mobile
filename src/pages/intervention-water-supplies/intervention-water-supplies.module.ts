import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionWaterSuppliesPage } from './intervention-water-supplies';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    InterventionWaterSuppliesPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionWaterSuppliesPage),
      ComponentsModule,
      PipesModule,
  ],
  exports: [
    InterventionWaterSuppliesPage
  ]
})
export class InterventionWaterSuppliesPageModule {}
