import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingFireProtectionPage } from './building-fire-protection';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BuildingFireProtectionPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingFireProtectionPage),
    PipesModule
  ],
})
export class BuildingFireProtectionPageModule {}
