import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingPnapsPage } from './building-pnaps';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BuildingPnapsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingPnapsPage),
    PipesModule
  ],
})
export class BuildingPnapsPageModule {}
