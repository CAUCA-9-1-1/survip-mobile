import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingHazardousMaterialsPage } from './building-hazardous-materials';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BuildingHazardousMaterialsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingHazardousMaterialsPage),
    PipesModule
  ],
})
export class BuildingHazardousMaterialsPageModule {}
