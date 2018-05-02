import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingMainPage } from './building-main';

@NgModule({
  declarations: [
    BuildingMainPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingMainPage),
  ],
})
export class BuildingMainPageModule {}
