import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingDetailsPage } from './building-details';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BuildingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingDetailsPage),
    PipesModule
  ],
})
export class BuildingDetailsPageModule {}
