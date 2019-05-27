import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionHomeComponent } from './inspection-home/inspection-home.component';
import { InspectionGeneralComponent } from './inspection-general/inspection-general.component';

const routes: Routes = [
    {
      path: '',
      component: InspectionHomeComponent,
      children: [
        { path: '', component: InspectionGeneralComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule { }
