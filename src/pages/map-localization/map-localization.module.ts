import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapLocalizationPage } from './map-localization';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    MapLocalizationPage,
  ],
  imports: [
    IonicPageModule.forChild(MapLocalizationPage),
      TranslateModule.forChild(),
  ],
})
export class MapLocalizationPageModule {}
