import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingAlarmPanelsPage } from './building-alarm-panels';

@NgModule({
  declarations: [
    BuildingAlarmPanelsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingAlarmPanelsPage),
  ],
})
export class BuildingAlarmPanelsPageModule {}
