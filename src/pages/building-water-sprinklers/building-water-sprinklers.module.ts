import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingWaterSprinklersPage } from './building-water-sprinklers';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BuildingWaterSprinklersPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingWaterSprinklersPage),
    PipesModule
  ],
})
export class BuildingWaterSprinklersPageModule {}
