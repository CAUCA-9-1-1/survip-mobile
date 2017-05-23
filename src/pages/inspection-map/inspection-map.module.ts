import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionMapPage } from './inspection-map';
import {IgoMapModule, IgoModule} from 'igo2';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    InspectionMapPage,
  ],
  imports: [
    IgoModule.forRoot(),
    IonicPageModule.forChild(InspectionMapPage),
  ],
  entryComponents: [
  ],
  exports: [
    InspectionMapPage,
  ]
})
export class InspectionMapPageModule {}
