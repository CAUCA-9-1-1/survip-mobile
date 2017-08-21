import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionsPage } from './inspections';

@NgModule({
  declarations: [
    InspectionsPage
  ],
  imports: [
    IonicPageModule.forChild(InspectionsPage),
  ],
  exports: [
    InspectionsPage
  ],
  providers: [

  ]
})
export class InspectionsPageModule {}
