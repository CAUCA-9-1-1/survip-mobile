import {EventEmitter, Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { InspectionSurveyAnswer, SurveyQuestionTypeEnum } from 'src/app/shared/models/inspection-survey-answer';
import { InspectionSurveySummaryCategory } from 'src/app/shared/models/inspection-survey-summary-category';
import { InspectionSurveySummary } from 'src/app/shared/models/inspection-survey-summary';

@Injectable()
export class InspectionSurveyAnswerRepositoryProvider {

    public questionAnswered: EventEmitter<any> = new EventEmitter<any>();

    constructor(
      private storage: OfflineStorage) {
    }

    public getQuestionList(idInspection: string): Promise<InspectionSurveyAnswer[]> {
      return this.storage.get('inspection_survey_questions_' + idInspection);
    }

    public async getAnswerList(idInspection: string): Promise<InspectionSurveyAnswer[]> {
        const answers = await this.storage.get('inspection_survey_answers_' + idInspection);
        return answers || [];
    }

    public async saveAnswers(idInspection: string, answers: InspectionSurveyAnswer[]): Promise<boolean> {
      return this.storage.set('inspection_survey_answers_' + idInspection, answers);
    }

    public async getAnswerSummaryList(idInspection: string): Promise<InspectionSurveySummaryCategory[]> {

      const answers = await this.getAnswerList(idInspection);
      const summary: InspectionSurveySummaryCategory[] = [];

      answers.forEach(answer => {

        const item = this.getSummaryGroup(answer, summary);
        const newSum = this.generateSurveySummary(answer);
        item.answerSummary.push(newSum);
      });

      return summary;
    }

  private generateSurveySummary(answer) {
    const newSum: InspectionSurveySummary = new InspectionSurveySummary();

    newSum.answer = answer.answer;
    if (answer.questionType === SurveyQuestionTypeEnum.choiceAnswer) {
      const foundChoice = answer.choicesList.find(choice => choice.id === answer.idSurveyQuestionChoice);
      if (foundChoice != null) {
        newSum.answer = foundChoice.description;
      }
    }

    newSum.id = answer.id;
    newSum.questionDescription = answer.description;
    newSum.questionTitle = answer.title;
    newSum.questionType = answer.questionType;
    newSum.sequence = answer.sequence;
    newSum.isRecursive = false;
    if (answer.childSurveyAnswerList != null) {
      newSum.recursiveAnswer = [];
      newSum.isRecursive = true;

      answer.childSurveyAnswerList.forEach(child => {

        if (child.answer != null) {
          const newChild = this.generateSurveySummary(child);
          newSum.recursiveAnswer.push(newChild);
        }
      });
    }
    return newSum;
  }

  private getSummaryGroup(answer, summary: InspectionSurveySummaryCategory[]) {
    let item = summary.find(i => i.title === answer.title);
    if (item == null) {
      item = new InspectionSurveySummaryCategory();
      item.title = answer.title;
      item.answerSummary = [];
      summary.push(item);
    }
    return item;
  }
}
