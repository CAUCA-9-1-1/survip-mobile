import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionWaterSuppliesPage } from './intervention-water-supplies';

@NgModule({
  declarations: [
    InterventionWaterSuppliesPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionWaterSuppliesPage),
  ],
  exports: [
    InterventionWaterSuppliesPage
  ]
})
export class InterventionWaterSuppliesPageModule {}
