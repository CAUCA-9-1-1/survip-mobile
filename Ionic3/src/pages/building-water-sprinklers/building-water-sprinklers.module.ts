import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingWaterSprinklersPage } from './building-water-sprinklers';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BuildingWaterSprinklersPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingWaterSprinklersPage),
    PipesModule,
      TranslateModule.forChild(),
  ],
})
export class BuildingWaterSprinklersPageModule {}
