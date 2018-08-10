import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapLocalizationPage } from './map-localization';

@NgModule({
  declarations: [
    MapLocalizationPage,
  ],
  imports: [
    IonicPageModule.forChild(MapLocalizationPage),
  ],
})
export class MapLocalizationPageModule {}
