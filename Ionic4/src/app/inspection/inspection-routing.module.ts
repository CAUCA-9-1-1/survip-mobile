import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionHomeComponent } from './inspection-home/inspection-home.component';
import { InspectionGeneralComponent } from './inspection-general/inspection-general.component';
import { InspectionBuildingsComponent } from './inspection-buildings/inspection-buildings.component';
import { InspectionFireHydrantsComponent } from './inspection-fire-hydrants/inspection-fire-hydrants.component';
import { InspectionImplantationPlanComponent } from './inspection-implantation-plan/inspection-implantation-plan.component';
import { InspectionCoursesComponent } from './inspection-courses/inspection-courses.component';

const routes: Routes = [
    {
      path: '',
      component: InspectionHomeComponent,
      children: [
        { path: '', redirectTo: 'general' },
        { path: 'general', component: InspectionGeneralComponent },
        { path: 'buildings', component: InspectionBuildingsComponent },
        { path: 'fire-hydrants', component: InspectionFireHydrantsComponent },
        { path: 'implantation-plan', component: InspectionImplantationPlanComponent },
        { path: 'courses', component: InspectionCoursesComponent }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule { }
