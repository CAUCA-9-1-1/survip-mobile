import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionListPage } from './inspection-list';
import {RiskLevelRepositoryProvider} from '../../providers/repositories/risk-level-repository';
import {InspectionRepositoryProvider} from '../../providers/repositories/inspection-repository-provider.service';
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";
import {ProgressBarModule} from "angular-progress-bar";

@NgModule({
  declarations: [
    InspectionListPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionListPage),
      ComponentsModule,
      TranslateModule.forChild(),
    ProgressBarModule
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
