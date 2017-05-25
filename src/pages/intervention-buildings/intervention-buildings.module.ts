import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionBuildingsPage } from './intervention-buildings';

@NgModule({
  declarations: [
    InterventionBuildingsPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionBuildingsPage),
  ],
  exports: [
    InterventionBuildingsPage
  ]
})
export class InterventionBuildingsPageModule {}
