import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionMapPage } from './inspection-map';
import { MaterialModule } from '@angular/material';
import {IgoModule} from 'igo2';
import {DirectivesModule} from '../../directives/directives.module';

@NgModule({
  declarations: [
    InspectionMapPage,
  ],
  imports: [
    MaterialModule,
    DirectivesModule,
    IgoModule,
    IonicPageModule.forChild(InspectionMapPage),
  ],
  exports: [
    InspectionMapPage
  ]
})
export class InspectionMapPageModule {}
