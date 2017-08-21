import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionsPage } from './inspections';
import { MaterialModule} from '@angular/material'

@NgModule({
  declarations: [
  ],
  imports: [
    MaterialModule,
    IonicPageModule.forChild(InspectionsPage),
  ]
})
export class InspectionsPageModule {}
