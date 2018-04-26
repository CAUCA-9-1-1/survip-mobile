import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CityFireHydrantPage } from './city-fire-hydrant';

@NgModule({
  declarations: [
    CityFireHydrantPage,
  ],
  imports: [
    IonicPageModule.forChild(CityFireHydrantPage),
  ],
})
export class CityFireHydrantPageModule {}
