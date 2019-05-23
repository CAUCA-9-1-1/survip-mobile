import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InspectionListPage } from './inspection-list.page';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { Inspection } from '../shared/interfaces/inspection.interface';
import { InspectionsComponent } from './inspections/inspections.component';

const routes: Routes = [
  {
    path: '',
    component: InspectionsComponent,
    children: [
      {
        path: '',
        component: InspectionListPage
      }
    ]
  }
];

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [InspectionListPage, InspectionsComponent]
})
export class InspectionListPageModule {}
