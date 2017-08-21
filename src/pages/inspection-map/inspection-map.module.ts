import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionMapPage } from './inspection-map';
import { MaterialModule } from '@angular/material';
import {IgoModule} from 'igo2';

@NgModule({
  declarations: [
    InspectionMapPage,
  ],
  imports: [
    MaterialModule,
    IgoModule,
    IonicPageModule.forChild(InspectionMapPage),
  ],
  exports: [
    InspectionMapPage
  ]
})
export class InspectionMapPageModule {}
