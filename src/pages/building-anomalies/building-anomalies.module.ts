import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingAnomaliesPage } from './building-anomalies';

@NgModule({
  declarations: [
    BuildingAnomaliesPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingAnomaliesPage),
  ],
})
export class BuildingAnomaliesPageModule {}
