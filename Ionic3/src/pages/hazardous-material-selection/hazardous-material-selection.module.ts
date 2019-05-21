import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HazardousMaterialSelectionPage } from './hazardous-material-selection';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HazardousMaterialSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(HazardousMaterialSelectionPage),
    PipesModule
  ],
})
export class HazardousMaterialSelectionPageModule {}
