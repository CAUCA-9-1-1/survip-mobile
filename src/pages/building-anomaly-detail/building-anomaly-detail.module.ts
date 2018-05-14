import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingAnomalyDetailPage } from './building-anomaly-detail';

@NgModule({
  declarations: [
    BuildingAnomalyDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingAnomalyDetailPage),
  ],
})
export class BuildingAnomalyDetailPageModule {}
