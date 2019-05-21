import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CityFireHydrantPage } from './city-fire-hydrant';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    CityFireHydrantPage,
  ],
  imports: [
    IonicPageModule.forChild(CityFireHydrantPage),
      ComponentsModule,
      PipesModule,
      TranslateModule.forChild()
  ],
})
export class CityFireHydrantPageModule {}
