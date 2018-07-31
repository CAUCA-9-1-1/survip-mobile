import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionListPage } from './inspection-list';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {MaterialModule} from '@angular/material';
import {InspectionRepositoryProvider} from '../../providers/repositories/inspection-repository-provider.service';
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InspectionListPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionListPage),
      ComponentsModule,
      TranslateModule.forChild(),
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
