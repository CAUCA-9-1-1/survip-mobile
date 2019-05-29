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
import { CityFireHydrantsComponent } from './components/city-fire-hydrants/city-fire-hydrants.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { CourseDetailLaneComponent } from './components/course-detail-lane/course-detail-lane.component';

@NgModule({
  declarations: [
    InspectionHomeComponent,
    InspectionGeneralComponent,
    InspectionFireHydrantsComponent,
    InspectionCoursesComponent,
    InspectionImplantationPlanComponent,
    InspectionBuildingsComponent,
    CityFireHydrantsComponent,
    CourseDetailComponent,
    CourseDetailLaneComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    CommonModule,
    IonicModule,
    InspectionRoutingModule
  ],
  entryComponents: [
    CityFireHydrantsComponent,
    CourseDetailComponent,
    CourseDetailLaneComponent,
  ]
})
export class InspectionModule { }
