import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionFireProtectionPage } from './intervention-fire-protection';

@NgModule({
  declarations: [
    InterventionFireProtectionPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionFireProtectionPage),
  ],
  exports: [
    InterventionFireProtectionPage
  ]
})
export class InterventionFireProtectionPageModule {}
