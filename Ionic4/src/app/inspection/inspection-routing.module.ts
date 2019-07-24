import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionHomeComponent } from './inspection-home/inspection-home.component';
import { InspectionGeneralComponent } from './inspection-general/inspection-general.component';
import { InspectionBuildingsComponent } from './inspection-buildings/inspection-buildings.component';
import { InspectionFireHydrantsComponent } from './inspection-fire-hydrants/inspection-fire-hydrants.component';
import { InspectionImplantationPlanComponent } from './inspection-implantation-plan/inspection-implantation-plan.component';
import { InspectionCoursesComponent } from './inspection-courses/inspection-courses.component';
import { InspectionSurveySummaryComponent } from './inspection-survey-summary/inspection-survey-summary.component';
import { SurveySummaryGuard } from './guards/survey-summary.guard';
import { InspectionSurveyComponent } from './inspection-survey/inspection-survey.component';
import { SurveyGuard } from './guards/survey.guard';

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
        { path: 'courses', component: InspectionCoursesComponent },
        { path: 'survey-summary', component: InspectionSurveySummaryComponent, canActivate: [SurveySummaryGuard] },
        { path: 'survey', component: InspectionSurveyComponent, canActivate: [SurveyGuard] }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionRoutingModule { }
