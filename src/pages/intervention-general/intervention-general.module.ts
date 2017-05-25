import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionGeneralPage } from './intervention-general';

@NgModule({
  declarations: [
    InterventionGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionGeneralPage),
  ],
  exports: [
    InterventionGeneralPage
  ]
})
export class InterventionGeneralPageModule {}
