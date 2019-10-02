import { Component, OnInit, Output, Input, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { TranslateService } from '@ngx-translate/core';
import { InspectionSurveyAnswer, SurveyQuestionTypeEnum } from 'src/app/shared/models/inspection-survey-answer';

@Component({
  selector: 'app-survey-parent-child-question',
  templateUrl: './survey-parent-child-question.component.html',
  styleUrls: ['./survey-parent-child-question.component.scss'],
})
export class SurveyParentChildQuestionComponent implements OnInit {
  @ViewChild('questionGroup', { static: true }) questionGroup: ElementRef;
  @Input() answer: InspectionSurveyAnswer;
  @Output() questionAnswered = new EventEmitter<any>();
  @Output() groupAnswersCompleted = new EventEmitter<any>();
  @Output() answerGroupDeleted = new EventEmitter<any>();
  @Input() groupIndex = 1;

  public answeredQuestions: InspectionSurveyAnswer[] = [];
  public questionIndex = 0;
  public labels = {};
  public groupIcon = 'md-arrow-dropdown';
  public displayGroup = 'block';

  constructor(
    private msgTools: MessageToolsProvider,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.translateService.get(['surveyDeleteQuestionGroup', 'confirmation'])
      .subscribe(labels => this.labels = labels, error => console.log(error));
    this.loadAnsweredQuestion();
  }

  private loadAnsweredQuestion() {
    if (this.answer.childSurveyAnswerList.length === 0) {
      this.displayGroup = 'none';
    } else {
      this.displayGroup = 'block';
      this.answeredQuestions = this.answer.childSurveyAnswerList.filter((answer) => answer.answer != null);
      if (this.answeredQuestions.length === 0) {
        this.answeredQuestions.push(this.answer.childSurveyAnswerList[0]);
      } else {
        this.questionIndex = this.answer.childSurveyAnswerList.filter((answer) => answer.answer != null).length - 1;
        this.getNextQuestion();
      }
    }
  }

  private validateLastQuestionAnswer() {
    const nextId = this.getNextQuestionId();
    if (!nextId || nextId === '00000000-0000-0000-0000-000000000000') {
      this.groupAnswersCompleted.emit(this.answer);
    } else {
      this.getNextQuestion(nextId);
    }
  }

  private getNextQuestion(nextQuestionId?: string) {

    let nextId = nextQuestionId;
    if (!nextId) {
      nextId = this.getNextQuestionId();
    }
    const nextQuestion = this.answer.childSurveyAnswerList.find((question) => question.idSurveyQuestion === nextId);
    if (nextQuestion) {
      this.answeredQuestions.push(nextQuestion);
      this.questionIndex++;
    }
  }

  private getNextQuestionId(): string {
    let retVal = this.answeredQuestions[this.questionIndex].idSurveyQuestionNext;
    if (this.answeredQuestions[this.questionIndex].answer) {
      if (this.answeredQuestions[this.questionIndex].questionType === SurveyQuestionTypeEnum.choiceAnswer) {
        const childIndex = this.getQuestionIndex();
        const questionChoice = this.answer.childSurveyAnswerList[childIndex].choicesList
          .find(choice => choice.id === this.answeredQuestions[this.questionIndex].idSurveyQuestionChoice);
        if (questionChoice && questionChoice.idSurveyQuestionNext) {
          retVal = questionChoice.idSurveyQuestionNext;
        }
      }
      if (!retVal) {
        retVal = this.getNextSequencedQuestionId();
      }
    }
    return retVal;
  }

  private getNextSequencedQuestionId() {
    const nextSequencedQuestion = this.answer.childSurveyAnswerList
      .find(question => question.sequence > this.answeredQuestions[this.questionIndex].sequence);
    return nextSequencedQuestion ? nextSequencedQuestion.idSurveyQuestion : null;
  }

  private getQuestionIndex() {
    const questionCount = this.answer.childSurveyAnswerList.length;
    for (let index = 0; index < questionCount; index++) {
      if (this.answer.childSurveyAnswerList[index].idSurveyQuestion === this.answeredQuestions[this.questionIndex].idSurveyQuestion) {
        return index;
      }
    }
  }

  public validateAnswer() {
    this.questionAnswered.emit(this.answer);
    this.validateLastQuestionAnswer();
  }

  public async deleteQuestionGroup() {
    const canDelete = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyDeleteQuestionGroup']);
    if (canDelete) {
      const ids = [];
      this.answeredQuestions.forEach(answer => {
        if (answer.id) {
          ids.push(answer.id);
        }
      });
      this.loadAnsweredQuestion();
      this.answerGroupDeleted.emit(this.answer.id);
    }
  }

  public manageQuestionGroupDisplay() {
    if (this.questionGroup.nativeElement.style.display === 'none') {
      this.questionGroup.nativeElement.style.display = 'block';
      this.groupIcon = 'md-arrow-dropdown';
    } else {
      this.questionGroup.nativeElement.style.display = 'none';
      this.groupIcon = 'md-arrow-dropup';
    }
  }

  private findAnswerById(answerId: string) {
    const answerCount = this.answer.childSurveyAnswerList.length;
    for (let index = 0; index < answerCount; index++) {
      if (this.answer.childSurveyAnswerList[index].id === answerId) {
        return index;
      }
    }
    return 0;
  }

  public deleteRemainingAnswers(answerId: string) {
    const startIndex = this.findAnswerById(answerId) + 1;
    const ids = [];

    for (let index = startIndex; index < this.answer.childSurveyAnswerList.length; index++) {
      if (this.answer.childSurveyAnswerList[index].id) {
        ids.push(this.answer.childSurveyAnswerList[index].id);
      }
      this.resetAnswerCollection(index);
    }

    this.answeredQuestions = this.answer.childSurveyAnswerList.filter((answer) => answer.answer != null && answer.answer !== '');
    this.questionIndex = this.answeredQuestions.length - 1;
  }

  private resetAnswerCollection(index: number) {
    this.answer.childSurveyAnswerList[index].id = null;
    this.answer.childSurveyAnswerList[index].idSurveyQuestionChoice = null;
    this.answer.childSurveyAnswerList[index].answer = '';
  }

}
