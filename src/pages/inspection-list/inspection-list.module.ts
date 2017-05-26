import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionListPage } from './inspection-list';
import {InspectionRepositoryProvider} from '../../providers/repositories/inspection-repository';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';

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
    RiskLevelRepositoryProvider,
    InspectionRepositoryProvider
  ]
})
export class InspectionListPageModule {}
