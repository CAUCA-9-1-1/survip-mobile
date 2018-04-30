import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingPnapsPage } from './building-pnaps';

@NgModule({
  declarations: [
    BuildingPnapsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingPnapsPage),
  ],
})
export class BuildingPnapsPageModule {}
