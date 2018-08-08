import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FireHydrantPage } from './fire-hydrant';
import {TranslateModule} from "@ngx-translate/core";
import {PipesModule} from "../../pipes/pipes.module";
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    FireHydrantPage,
  ],
  imports: [
    IonicPageModule.forChild(FireHydrantPage),
      TranslateModule.forChild(),
      PipesModule,
      ComponentsModule,
  ],
})
export class FireHydrantPageModule {}
