import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingDetailsPage } from './building-details';

@NgModule({
  declarations: [
    BuildingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingDetailsPage),
  ],
})
export class BuildingDetailsPageModule {}
