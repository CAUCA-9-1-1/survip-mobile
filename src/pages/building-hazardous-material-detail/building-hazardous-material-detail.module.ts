import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingHazardousMaterialDetailPage } from './building-hazardous-material-detail';

@NgModule({
  declarations: [
    BuildingHazardousMaterialDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingHazardousMaterialDetailPage),
  ],
})
export class BuildingHazardousMaterialDetailPageModule {}
