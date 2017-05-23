import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionMapPage } from './inspection-map';

@NgModule({
  declarations: [
    InspectionMapPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionMapPage),
  ],
  exports: [
    InspectionMapPage
  ]
})
export class InspectionMapPageModule {}
