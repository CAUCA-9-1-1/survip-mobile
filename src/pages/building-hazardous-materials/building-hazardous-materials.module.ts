import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingHazardousMaterialsPage } from './building-hazardous-materials';

@NgModule({
  declarations: [
    BuildingHazardousMaterialsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingHazardousMaterialsPage),
  ],
})
export class BuildingHazardousMaterialsPageModule {}
