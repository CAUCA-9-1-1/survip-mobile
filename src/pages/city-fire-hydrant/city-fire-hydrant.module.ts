import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CityFireHydrantPage } from './city-fire-hydrant';
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CityFireHydrantPage,
  ],
  imports: [
    IonicPageModule.forChild(CityFireHydrantPage),
      ComponentsModule,
      PipesModule,
  ],
})
export class CityFireHydrantPageModule {}
