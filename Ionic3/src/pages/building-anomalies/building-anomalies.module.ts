import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingAnomaliesPage } from './building-anomalies';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BuildingAnomaliesPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingAnomaliesPage),
    PipesModule,
      TranslateModule.forChild(),
  ],
})
export class BuildingAnomaliesPageModule {}
