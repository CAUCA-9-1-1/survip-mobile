import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingMainPage } from './building-main';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    BuildingMainPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingMainPage),
    ComponentsModule
  ],
})
export class BuildingMainPageModule {}
