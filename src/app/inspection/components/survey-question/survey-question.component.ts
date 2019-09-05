import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SurveyQuestionTypeEnum, InspectionSurveyAnswer } from 'src/app/shared/models/inspection-survey-answer';
import { MessageToolsProvider } from 'src/app/core/services/utilities/message-tools/message-tools';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-UUID';

@Component({
  selector: 'app-survey-question',
  templateUrl: './survey-question.component.html',
  styleUrls: ['./survey-question.component.scss'],
})
export class SurveyQuestionComponent implements OnInit {

  private changingValueTimer = null;
  private labels = {};
  private dataSource;

  @Input() showTitle = true;
  @Output() questionAnswered = new EventEmitter<any>();
  @Output() remainingQuestionResetNeeded = new EventEmitter<any>();
  @Input() idParent = null;

  public questionTypeEnum = SurveyQuestionTypeEnum;
  public answer = '';

  public get textAnswer(): string {
    return this.answer;
  }

  public set textAnswer(value: string) {
    this.answer = value;
    this.dataSource.answer = this.answer;
    this.saveAnswer();
  }

  @Input()
  set question(value: InspectionSurveyAnswer) {
    this.dataSource = value;
    if (this.dataSource.answer) {
      this.answer = this.dataSource.answer;
    } else {
      this.answer = this.dataSource.answer = '';
    }
    if (this.dataSource.questionType === SurveyQuestionTypeEnum.textAnswer) {
      this.saveAnswer();
    }
  }

  get question() {
    return this.dataSource;
  }

  constructor(
    private msgTools: MessageToolsProvider,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.translateService.get(['surveyChangingAnswerQuestion', 'confirmation'])
      .subscribe(labels => this.labels = labels, error => console.log(error));
  }

  public async validateAnswer() {
    if (await this.validateNextQuestionSequence()) {
      if (this.answer) {
        this.dataSource.answer = this.answer;
        if (this.dataSource.questionType === this.questionTypeEnum.choiceAnswer) {
          this.dataSource.idSurveyQuestionChoice = this.answer;
        }
        this.saveAnswer();
      }
    }
  }

  public textAnswerChanged() {
    this.saveAnswer();
  }

  private saveAnswer() {
    if (this.idParent) {
      this.dataSource.idParent = this.idParent;
    }
    if (this.dataSource.id != null) {
      this.dataSource.id = UUID.UUID();
    }
    this.questionAnswered.emit(this.question);
  }

  private async validateNextQuestionSequence() {
    if (this.nextQuestionChanged()) {
      const canDelete = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyChangingAnswerQuestion']);
      if (canDelete) {
        this.remainingQuestionResetNeeded.emit(this.dataSource.id);
        return true;
      } else {
        this.answer = this.dataSource.answer;
      }
      return false;
    }
    return true;
  }

  private nextQuestionChanged() {
    let retValue = false;
    if (this.dataSource.answer) {
      if (this.dataSource.questionType === SurveyQuestionTypeEnum.choiceAnswer) {
        retValue = this.nextQuestionFromChoiceChanged();
      }
    }
    return retValue;
  }

  private nextQuestionFromChoiceChanged() {
    const newChoice = this.dataSource.choicesList.filter((choice) => choice.id === this.dataSource.idSurveyQuestionChoice);
    const originalChoice = this.dataSource.choicesList.filter((choice) => choice.id === this.answer);

    return (newChoice[0].idSurveyQuestionNext !== originalChoice[0].idSurveyQuestionNext);
  }
}
