import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingAnomaliesPage } from './building-anomalies';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BuildingAnomaliesPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingAnomaliesPage),
    PipesModule
  ],
})
export class BuildingAnomaliesPageModule {}
