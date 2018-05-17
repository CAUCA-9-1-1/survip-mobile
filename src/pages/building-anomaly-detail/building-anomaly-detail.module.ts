import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingAnomalyDetailPage } from './building-anomaly-detail';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    BuildingAnomalyDetailPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(BuildingAnomalyDetailPage),
  ],
})
export class BuildingAnomalyDetailPageModule {}
