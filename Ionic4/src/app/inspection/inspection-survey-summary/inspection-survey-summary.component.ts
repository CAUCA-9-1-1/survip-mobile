import { Component, OnInit } from '@angular/core';
import { InspectionSurveySummaryCategory } from 'src/app/shared/models/inspection-survey-summary-category';
import { SurveyQuestionTypeEnum } from 'src/app/shared/models/inspection-survey-answer';
import { Router } from '@angular/router';
import { InspectionSurveyAnswerRepositoryProvider } from 'src/app/core/services/repositories/inspection-survey-answer-repository-provider';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { TranslateService } from '@ngx-translate/core';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';

@Component({
  selector: 'app-inspection-survey-summary',
  templateUrl: './inspection-survey-summary.component.html',
  styleUrls: ['./inspection-survey-summary.component.scss'],
})
export class InspectionSurveySummaryComponent implements OnInit {

  public inspectionQuestionSummaryCategory: InspectionSurveySummaryCategory[] = [];
  public questionTypeEnum = SurveyQuestionTypeEnum;
  private labels = {};

  constructor(
    private router: Router,
    private controller: InspectionSurveyAnswerRepositoryProvider,
    private msgTools: MessageToolsProvider,
    private translateService: TranslateService,
    private inspectionController: InspectionControllerProvider
  ) {
    this.loadInspectionQuestionSummary();
  }

  ngOnInit() {
    this.translateService.get(['confirmation', 'surveyEditionQuestion', 'surveyEditionRedirectionMessage'])
      .subscribe(
        labels => this.labels = labels,
        error => console.log(error));
  }

  public async loadInspectionQuestionSummary() {
    this.inspectionQuestionSummaryCategory = await this.controller.getAnswerSummaryList(this.inspectionController.idInspection);
  }

  public async editSurvey() {
    const canEdit = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyEditionQuestion']);
    if (canEdit) {
      await this.inspectionController.setSurveyCompletionStatus(false);
      await this.msgTools.showToast(this.labels['surveyEditionRedirectionMessage'], 3);
      this.router.navigate(['/inspection/' + this.inspectionController.idInspection + '/survey']);
    }
  }
}
