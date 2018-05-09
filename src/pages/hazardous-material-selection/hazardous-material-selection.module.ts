import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HazardousMaterialSelectionPage } from './hazardous-material-selection';

@NgModule({
  declarations: [
    HazardousMaterialSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(HazardousMaterialSelectionPage),
  ],
})
export class HazardousMaterialSelectionPageModule {}
