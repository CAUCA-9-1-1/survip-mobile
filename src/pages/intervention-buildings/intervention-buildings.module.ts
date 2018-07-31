import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionBuildingsPage } from './intervention-buildings';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InterventionBuildingsPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionBuildingsPage),
      TranslateModule.forChild()
  ],
  exports: [
    InterventionBuildingsPage
  ]
})
export class InterventionBuildingsPageModule {}
