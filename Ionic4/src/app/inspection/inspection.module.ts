import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { CityFireHydrantsComponent } from './components/city-fire-hydrants/city-fire-hydrants.component';
import { CourseDetailLaneComponent } from './components/course-detail-lane/course-detail-lane.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { InspectionVisitComponent } from './components/inspection-visit/inspection-visit.component';
import { SurveySummaryGuard } from './guards/survey-summary.guard';
import { InspectionBuildingsComponent } from './inspection-buildings/inspection-buildings.component';
import { InspectionCoursesComponent } from './inspection-courses/inspection-courses.component';
import { InspectionFireHydrantsComponent } from './inspection-fire-hydrants/inspection-fire-hydrants.component';
import { InspectionGeneralComponent } from './inspection-general/inspection-general.component';
import { InspectionHomeComponent } from './inspection-home/inspection-home.component';
import { InspectionImplantationPlanComponent } from './inspection-implantation-plan/inspection-implantation-plan.component';
import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionSurveySummaryComponent } from './inspection-survey-summary/inspection-survey-summary.component';
import { SurveyGuard } from './guards/survey.guard';
import { InspectionSurveyComponent } from './inspection-survey/inspection-survey.component';
import { SurveyParentChildQuestionComponent } from './components/survey-parent-child-question/survey-parent-child-question.component';
import { SurveyQuestionComponent } from './components/survey-question/survey-question.component';

@NgModule({
  declarations: [
    InspectionHomeComponent,
    InspectionGeneralComponent,
    InspectionFireHydrantsComponent,
    InspectionCoursesComponent,
    InspectionImplantationPlanComponent,
    InspectionBuildingsComponent,
    InspectionSurveySummaryComponent,
    CityFireHydrantsComponent,
    CourseDetailComponent,
    CourseDetailLaneComponent,
    InspectionVisitComponent,
    InspectionSurveySummaryComponent,
    InspectionSurveyComponent,
    SurveyQuestionComponent,
    SurveyParentChildQuestionComponent
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
    InspectionVisitComponent,
    SurveyQuestionComponent,
    SurveyParentChildQuestionComponent
  ],
  providers: [
    SurveyGuard,
    SurveySummaryGuard
  ]
})
export class InspectionModule { }
