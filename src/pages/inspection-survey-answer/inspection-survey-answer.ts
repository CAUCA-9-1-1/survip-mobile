import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InspectionSurveyAnswer, SurveyQuestionTypeEnum} from "../../models/inspection-survey-answer";
import {InspectionSurveyAnswerRepositoryProvider} from "../../providers/repositories/inspection-survey-answer-repository-provider";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
import {UUID} from "angular2-uuid";
import {InspectionControllerProvider} from "../../providers/inspection-controller/inspection-controller";

@IonicPage()
@Component({
    selector: 'page-inspection-survey-answer',
    templateUrl: 'inspection-survey-answer.html',
})
export class InspectionSurveyAnswerPage {
    public inspectionQuestionAnswer: InspectionSurveyAnswer[] = [];
    public inspectionSurveyQuestion: InspectionSurveyAnswer[] = [];
    public questionTypeEnum = SurveyQuestionTypeEnum;
    public idInspection: string = '';
    public inspectionSurveyCompleted: boolean = false;
    public selectedIndex = 0;
    public currentQuestion: InspectionSurveyAnswer = new InspectionSurveyAnswer();
    public currentAnswer: InspectionSurveyAnswer = new InspectionSurveyAnswer();
    public previousQuestionAvailable = false;
    public nextQuestionDisabled = false;
    public nextButtonTitle: string = 'Suivante';
    public nextQuestionId: string = '';
    public labels = {};
    public currentQuestionAnswerList: InspectionSurveyAnswer[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public surveyRepo: InspectionSurveyAnswerRepositoryProvider,
                private controller: InspectionControllerProvider,
                private messageTools: MessageToolsProvider,
                private translateService: TranslateService) {

        this.idInspection = this.navParams.get('idInspection');
        this.inspectionSurveyCompleted = this.navParams.get('inspectionSurveyCompleted');
        this.loadInspectionQuestion();
    }

    public ngOnInit() {
        this.translateService.get([
            'surveyCompletedMessage', 'surveyNextQuestion', 'complete', 'surveyDeleteQuestionGroup', 'confirmation'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
        this.nextButtonTitle = this.labels['surveyNextQuestion'];
    }

    public loadInspectionQuestion() {
      this.surveyRepo.getQuestionList(this.idInspection)
        .then(
          data => {
            this.inspectionSurveyQuestion = data;
            this.loadInspectionAnswer();
          },
          async () => {
            await this.messageTools.showToast('Une erreur est survenue lors du chargement du questionnaire veuillez réessayer ultérieurement.', 5);
            await this.navCtrl.pop();
          });
    }

    private loadInspectionAnswer() {
      this.surveyRepo.getAnswerList(this.idInspection)
        .then(async (data) => {
          this.inspectionQuestionAnswer = data;
          if (this.inspectionQuestionAnswer.length > 0) {
            this.selectedIndex = this.findQuestion(this.initAnswerStartQuestion());
          }
          this.currentQuestion = this.inspectionSurveyQuestion[this.selectedIndex];
          await this.initiateAnswers();
          this.getNextQuestionFromAnswer();
          this.manageNavigationDisplay();
        });
    }

    private findQuestion(idSurveyQuestion: string) {
        const questionCount = this.inspectionSurveyQuestion.length;
        for (let index = 0; index < questionCount; index++) {
            if (this.inspectionSurveyQuestion[index].idSurveyQuestion == idSurveyQuestion && (!this.inspectionSurveyQuestion[index].answer)) {
                return index;
            }
        }
    }

    private findAnswer(idSurveyQuestion: string) {
        const questionCount = this.inspectionQuestionAnswer.length;
        for (let index = 0; index < questionCount; index++) {
            if (this.inspectionQuestionAnswer[index].idSurveyQuestion == idSurveyQuestion) {
                return index;
            }
        }
        return this.inspectionQuestionAnswer.length;
    }

    private findLastAnswerForQuestion(idSurveyQuestion: string) {
        const questionCount = this.inspectionQuestionAnswer.length - 1;
        for (let index = questionCount; index >= 0; index--) {
            if (this.inspectionQuestionAnswer[index].idSurveyQuestion == idSurveyQuestion) {
                return index;
            }
        }
        return questionCount;
    }

    public findAnswerById(id: string): number {
        const answerCount = this.inspectionQuestionAnswer.length;
        for (let index = 0; index < answerCount; index++) {
            if (this.inspectionQuestionAnswer[index].id == id) {
                return index;
            }
        }
        return 0;
    }

    private async completeInspectionQuestion() {
      await this.controller.setSurveyCompletionStatus(true);
      await this.messageTools.showToast(this.labels['surveyCompletedMessage'], 3);
      setTimeout(() => {
          const currentPageIndex = this.navCtrl.getActive().index;
          this.navCtrl.push('InspectionSurveySummaryPage', {idInspection: this.idInspection})
              .then(async ()=>{await this.navCtrl.remove(currentPageIndex)});
      }, 3000);
    }

    public async previousQuestion() {
        const lastQuestion = this.inspectionQuestionAnswer[this.findAnswer(this.currentQuestion.idSurveyQuestion) - 1].idSurveyQuestion;
        this.selectedIndex = this.findQuestion(lastQuestion);
        this.currentQuestion = this.inspectionSurveyQuestion[this.selectedIndex];
        await this.initiateAnswers();
        this.getNextQuestionFromAnswer();
        this.manageNavigationDisplay();
    }

    public async nextQuestion() {
        if (this.selectedIndex == (this.inspectionSurveyQuestion.length - 1)) {
            await this.completeInspectionQuestion();
        } else {
            this.selectedIndex = this.findQuestion(this.nextQuestionId);
            this.currentQuestion = this.inspectionSurveyQuestion[this.selectedIndex];
            await this.initiateAnswers();
            this.getNextQuestionFromAnswer();
        }
        this.manageNavigationDisplay();
    }

    public async updateGroupQuestionAnswer(data) {
        await this.updateAnswerResult(data);
    }

    private async updateAnswerResult(answerGroup) {
      if (answerGroup) {
        const Index = this.findAnswerById(answerGroup.id);
        this.inspectionQuestionAnswer[Index] = answerGroup;
        await this.surveyRepo.saveAnswers(this.idInspection, this.inspectionQuestionAnswer);
      }
    }

    private manageNavigationDisplay() {
      this.previousQuestionAvailable = this.selectedIndex > 0;

      if ((this.selectedIndex == (this.inspectionSurveyQuestion.length - 1))) {
        this.nextButtonTitle = this.labels['complete'];
      } else {
        this.nextButtonTitle = this.labels['surveyNextQuestion'];
      }
    }

    public async getNextQuestionFromAnswer() {
        let answer = this.getCurrentAnswer();
        if (answer.answer) {
            if (answer.questionType == this.questionTypeEnum.choiceAnswer) {
                this.nextQuestionId = this.getChoiceNextQuestionId(answer.idSurveyQuestionChoice);
                if (!this.nextQuestionId) {
                    this.nextQuestionId = answer.idSurveyQuestionNext;
                }
            } else {
                this.nextQuestionId = answer.idSurveyQuestionNext;
            }
            if (!this.nextQuestionId) {
                this.nextQuestionId = this.getNextSequencedQuestion();
            }
            this.nextQuestionDisabled = false;
        } else {
            this.nextQuestionDisabled = true;
            this.nextQuestionId = null;
        }
        await this.surveyRepo.saveAnswers(this.idInspection, this.inspectionQuestionAnswer);
    }

    private getCurrentAnswer() {
        let answer = Object.assign({}, this.currentAnswer);
        if (this.currentQuestion.questionType == SurveyQuestionTypeEnum.groupedQuestion) {
            answer = Object.assign({}, this.currentQuestionAnswerList[0]);
            if (!this.isGroupQuestionComplete()) {
                answer.answer = '';
            }
        }
        return answer;
    }

    private isGroupQuestionComplete() {
        let retValue = false;
        this.currentQuestionAnswerList.forEach(answer => {
            if(answer.childSurveyAnswerList &&
               answer.childSurveyAnswerList
                   .filter(ca => ca.idSurveyQuestionNext == '00000000-0000-0000-0000-000000000000'
                                        && ca.answer != null).length > 0) {
                retValue = true;
            }
        });
        return retValue;
    }

    private getNextSequencedQuestion() {
        let nextId = null;
        const nextSequencedQuestions = this.inspectionSurveyQuestion.filter(question => question.idParent == null && question.sequence > this.currentQuestion.sequence);
        if (nextSequencedQuestions.length > 0) {
            nextId = nextSequencedQuestions[0].idSurveyQuestion;
        }
        return nextId;
    }

    private getChoiceNextQuestionId(idChoiceSelected) {
        let idNext = '';
        const count = this.currentQuestion.choicesList.length;
        for (let index = 0; index < count; index++) {
            if (this.currentQuestion.choicesList[index].id == idChoiceSelected) {
                if (this.currentQuestion.choicesList[index].idSurveyQuestionNext) {
                    idNext = this.currentQuestion.choicesList[index].idSurveyQuestionNext;
                }
                break;
            }
        }
        return idNext;
    }

    private async initQuestionGroupAnswers() {
        this.currentQuestionAnswerList = [];
        const answers = this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion == this.currentQuestion.idSurveyQuestion);
        if (answers.length > 0) {
            for (let index = 0; index < answers.length; index++) {
                this.currentQuestionAnswerList.push(this.updateChildWithAnswered(answers[index]));
            }
        } else {
            for (let index = 0; index <= this.inspectionSurveyQuestion[this.selectedIndex].minOccurrence; index++) {
                this.inspectionQuestionAnswer.push(this.createGroupAnswerParent());
                await this.surveyRepo.saveAnswers(this.idInspection, this.inspectionQuestionAnswer);
            }
            this.currentQuestionAnswerList = this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion == this.currentQuestion.idSurveyQuestion);
        }
    }

    private updateChildWithAnswered(answeredQuestion): InspectionSurveyAnswer {

        let mergedAnswered: InspectionSurveyAnswer = new InspectionSurveyAnswer();
        mergedAnswered = JSON.parse(JSON.stringify(this.inspectionSurveyQuestion[this.selectedIndex]));
        mergedAnswered.id = answeredQuestion.id;
        mergedAnswered.answer = answeredQuestion.answer;

        if (answeredQuestion.childSurveyAnswerList) {
            answeredQuestion.childSurveyAnswerList.forEach(answer => {
                let questionToAnswer = mergedAnswered.childSurveyAnswerList.find((question) => question.idSurveyQuestion == answer.idSurveyQuestion);
                if (questionToAnswer) {
                    questionToAnswer.id = answer.id;
                    questionToAnswer.answer = answer.answer;
                    questionToAnswer.idSurveyQuestionChoice = answer.idSurveyQuestionChoice;
                }
            });
        }

        return mergedAnswered;
    }

    public async initiateAnswers() {
        if (this.currentQuestion.questionType == SurveyQuestionTypeEnum.groupedQuestion) {
            await this.initQuestionGroupAnswers();
        } else {
            const answers = this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion == this.currentQuestion.idSurveyQuestion);
            if (answers.length > 0) {
                this.currentAnswer = answers[0];
            } else {
                const newAnswer: InspectionSurveyAnswer = JSON.parse(JSON.stringify(this.inspectionSurveyQuestion[this.selectedIndex]));
                newAnswer.id = UUID.UUID();
                if (newAnswer.childSurveyAnswerList != null) {
                  newAnswer.childSurveyAnswerList.forEach(answer => answer.id = UUID.UUID());
                }
                this.inspectionQuestionAnswer.push(newAnswer);
                this.currentAnswer = this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion == this.currentQuestion.idSurveyQuestion)[0];
            }
        }
    }

    public async addNewQuestionGroup() {
        if ((this.currentQuestionAnswerList.length < this.inspectionSurveyQuestion[this.selectedIndex].maxOccurrence) || this.inspectionSurveyQuestion[this.selectedIndex].maxOccurrence == 0) {
            let index = this.findLastAnswerForQuestion(this.currentQuestion.idSurveyQuestion);
            this.inspectionQuestionAnswer.splice(index + 1, 0, this.createGroupAnswerParent());
            await this.surveyRepo.saveAnswers(this.idInspection, this.inspectionQuestionAnswer);
            this.currentQuestionAnswerList = this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion == this.currentQuestion.idSurveyQuestion);
        }
        this.getNextQuestionFromAnswer();
    }

    public async deleteChildQuestion(answerId: string) {
        const index = this.findAnswerById(answerId);
        if (this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion == this.currentQuestion.idSurveyQuestion).length > 1) {
            this.inspectionQuestionAnswer.splice(index, 1);
            await this.surveyRepo.saveAnswers(this.idInspection, this.inspectionQuestionAnswer);
        } else {
            this.inspectionQuestionAnswer[index].childSurveyAnswerList = Object.assign([], this.currentQuestion.childSurveyAnswerList);
        }
        this.currentQuestionAnswerList = this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion == this.currentQuestion.idSurveyQuestion);
        this.getNextQuestionFromAnswer();
    }

    public async deleteRemainingAnswers(answerId: string) {
        const startIndex = this.findAnswerById(answerId) + 1;
        let ids = [];
        for (let index = startIndex; index < this.inspectionQuestionAnswer.length; index    ++) {
            if (this.inspectionQuestionAnswer[index].id) {
                ids.push(this.inspectionQuestionAnswer[index].id);
            }
        }
        if (ids.length > 0) {
          this.inspectionQuestionAnswer.splice(startIndex);
          await this.surveyRepo.saveAnswers(this.idInspection, this.inspectionQuestionAnswer);
        }
    }

    public createGroupAnswerParent() {
      let newAnswerParent = JSON.parse(JSON.stringify(this.inspectionSurveyQuestion[this.selectedIndex]));
      newAnswerParent.id = UUID.UUID();
      if (newAnswerParent.childSurveyAnswerList != null) {
        newAnswerParent.childSurveyAnswerList.forEach(answer => answer.id = UUID.UUID());
      }
      newAnswerParent.answer = "Group header";
      return newAnswerParent;
    }

    private initAnswerStartQuestion() {
      const answerCount = this.inspectionQuestionAnswer.length;
      for (let index = 0; index < answerCount; index++) {
        if (this.inspectionQuestionAnswer[index].questionType == SurveyQuestionTypeEnum.groupedQuestion) {
          if (this.inspectionQuestionAnswer[index].childSurveyAnswerList && this.inspectionQuestionAnswer[index].childSurveyAnswerList.length > 0) {
            if (this.inspectionQuestionAnswer[index].childSurveyAnswerList
              .filter(ca => ca.answer != null
                && ca.idSurveyQuestionNext == '00000000-0000-0000-0000-000000000000').length == 0) {
              return this.inspectionQuestionAnswer[index].idSurveyQuestion;
            }
          } else {
            return this.inspectionQuestionAnswer[index].idSurveyQuestion;
          }
        }
      }
      return this.inspectionQuestionAnswer[this.inspectionQuestionAnswer.length - 1].idSurveyQuestion;
    }
}
