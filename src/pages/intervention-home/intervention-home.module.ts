import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionHomePage } from './intervention-home';

@NgModule({
  declarations: [
    InterventionHomePage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionHomePage),
  ],
  exports: [
    InterventionHomePage
  ]
})
export class InterventionHomePageModule {}
