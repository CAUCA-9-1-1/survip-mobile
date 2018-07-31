import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionWaterSuppliesPage } from './intervention-water-supplies';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InterventionWaterSuppliesPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionWaterSuppliesPage),
      ComponentsModule,
      PipesModule,
      TranslateModule.forChild()
  ],
  exports: [
    InterventionWaterSuppliesPage
  ]
})
export class InterventionWaterSuppliesPageModule {}
