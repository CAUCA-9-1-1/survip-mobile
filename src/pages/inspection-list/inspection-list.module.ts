import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionListPage } from './inspection-list';
import {InspectionProvider} from '../../providers/inspection/inspection';
import {RiskLevelProvider} from '../../providers/risk-level/risk-level';

@NgModule({
  declarations: [
    InspectionListPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionListPage),
  ],
  exports: [
    InspectionListPage
  ],
  providers: [
    RiskLevelProvider,
    InspectionProvider
  ]
})
export class InspectionListPageModule {}
