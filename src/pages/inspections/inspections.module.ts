import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InspectionsPage } from './inspections';
import { InspectionListPage } from '../inspection-list/inspection-list';

@NgModule({
  declarations: [
    InspectionsPage,
    InspectionListPage,
  ],
  imports: [
    IonicPageModule.forChild(InspectionsPage),
  ]
})
export class InspectionsPageModule {}
