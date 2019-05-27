import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionHomeComponent } from './inspection-home/inspection-home.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { IonicModule } from '@ionic/angular';
import { InspectionGeneralComponent } from './inspection-general/inspection-general.component';
import { InspectionFireHydrantsComponent } from './inspection-fire-hydrants/inspection-fire-hydrants.component';
import { InspectionCoursesComponent } from './inspection-courses/inspection-courses.component';
import { InspectionImplantationPlanComponent } from './inspection-implantation-plan/inspection-implantation-plan.component';
import { InspectionBuildingsComponent } from './inspection-buildings/inspection-buildings.component';

@NgModule({
  declarations: [
    InspectionHomeComponent,
    InspectionGeneralComponent,
    InspectionFireHydrantsComponent,
    InspectionCoursesComponent,
    InspectionImplantationPlanComponent,
    InspectionBuildingsComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    CommonModule,
    IonicModule,
    InspectionRoutingModule
  ]
})
export class InspectionModule { }
