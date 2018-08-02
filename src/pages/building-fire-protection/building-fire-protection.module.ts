import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingFireProtectionPage } from './building-fire-protection';
import {PipesModule} from '../../pipes/pipes.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    BuildingFireProtectionPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingFireProtectionPage),
    PipesModule,
      TranslateModule.forChild()
  ],
})
export class BuildingFireProtectionPageModule {}
