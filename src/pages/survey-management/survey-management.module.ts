import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyManagementPage } from './survey-management';

@NgModule({
  declarations: [
    SurveyManagementPage,
  ],
  imports: [
    IonicPageModule.forChild(SurveyManagementPage),
  ],
})
export class SurveyManagementPageModule {}
