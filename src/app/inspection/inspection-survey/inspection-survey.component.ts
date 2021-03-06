import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {InspectionSurveyAnswer, SurveyQuestionTypeEnum} from 'src/app/shared/models/inspection-survey-answer';
import {Router} from '@angular/router';
import {InspectionSurveyAnswerRepositoryProvider} from 'src/app/core/services/repositories/inspection-survey-answer-repository-provider';
import {InspectionControllerProvider} from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import {MessageToolsProvider} from 'src/app/core/services/utilities/message-tools/message-tools';
import {TranslateService} from '@ngx-translate/core';
import {UUID} from 'angular2-UUID';

@Component({
    selector: 'app-inspection-survey',
    templateUrl: './inspection-survey.component.html',
    styleUrls: ['./inspection-survey.component.scss'],
})
export class InspectionSurveyComponent implements OnInit {
    public inspectionQuestionAnswer: InspectionSurveyAnswer[] = [];
    public inspectionSurveyQuestion: InspectionSurveyAnswer[] = [];
    public questionTypeEnum = SurveyQuestionTypeEnum;
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

    constructor(
        private router: Router,
        private surveyRepo: InspectionSurveyAnswerRepositoryProvider,
        private controller: InspectionControllerProvider,
        private messageTools: MessageToolsProvider,
        private translateService: TranslateService
    ) {
        this.loadInspection();
    }

    ngOnInit() {
        this.translateService.get(['surveyCompletedMessage', 'surveyNextQuestion', 'complete', 'surveyDeleteQuestionGroup', 'confirmation'])
            .subscribe(
                labels => {
                    this.labels = labels;
                    this.nextButtonTitle = this.labels['surveyNextQuestion'];
                },
                error => console.log(error));
    }

    private loadInspection() {
        this.inspectionSurveyCompleted = this.controller.inspection.isSurveyCompleted;
        this.loadInspectionQuestion();
    }

    public loadInspectionQuestion() {
        this.surveyRepo.getQuestionList(this.controller.idInspection)
            .then(
                data => {
                    this.inspectionSurveyQuestion = data;
                    this.loadInspectionAnswer();
                },
                async () => {
                    const message = 'Une erreur est survenue lors du chargement du questionnaire veuillez réessayer ultérieurement.';
                    await this.messageTools.showToast(message, 5);
                });
    }

    private loadInspectionAnswer() {
        this.surveyRepo.getAnswerList(this.controller.idInspection)
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
            if (this.inspectionSurveyQuestion[index].idSurveyQuestion === idSurveyQuestion
                && (!this.inspectionSurveyQuestion[index].answer)) {
                return index;
            }
        }
    }

    private findAnswer(idSurveyQuestion: string) {
        const questionCount = this.inspectionQuestionAnswer.length;
        for (let index = 0; index < questionCount; index++) {
            if (this.inspectionQuestionAnswer[index].idSurveyQuestion === idSurveyQuestion) {
                return index;
            }
        }
        return this.inspectionQuestionAnswer.length;
    }

    private findLastAnswerForQuestion(idSurveyQuestion: string) {
        const questionCount = this.inspectionQuestionAnswer.length - 1;
        for (let index = questionCount; index >= 0; index--) {
            if (this.inspectionQuestionAnswer[index].idSurveyQuestion === idSurveyQuestion) {
                return index;
            }
        }
        return questionCount;
    }

    public findAnswerById(id: string): number {
        const answerCount = this.inspectionQuestionAnswer.length;
        for (let index = 0; index < answerCount; index++) {
            if (this.inspectionQuestionAnswer[index].id === id) {
                return index;
            }
        }
        return 0;
    }

    private async completeInspectionQuestion() {
        await this.controller.setSurveyCompletionStatus(true);
        await this.messageTools.showToast(this.labels['surveyCompletedMessage'], 3);
        await this.router.navigate(['/inspection/' + this.controller.idInspection + '/survey-summary']);
    }

    public async goToPreviousQuestion() {
        const lastQuestion = this.inspectionQuestionAnswer[this.findAnswer(this.currentQuestion.idSurveyQuestion) - 1].idSurveyQuestion;
        this.selectedIndex = this.findQuestion(lastQuestion);
        this.currentQuestion = this.inspectionSurveyQuestion[this.selectedIndex];
        await this.initiateAnswers();
        this.nextQuestionId = '';
        this.getNextQuestionFromAnswer();
        this.manageNavigationDisplay();
    }

    public async goToNextQuestion() {
        if (this.selectedIndex === (this.inspectionSurveyQuestion.length - 1)) {
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
            await this.surveyRepo.saveAnswers(this.controller.idInspection, this.inspectionQuestionAnswer);
        }
    }

    private manageNavigationDisplay() {
        this.previousQuestionAvailable = this.selectedIndex > 0;

        if ((this.selectedIndex === (this.inspectionSurveyQuestion.length - 1))) {
            this.nextButtonTitle = this.labels['complete'];
        } else {
            this.nextButtonTitle = this.labels['surveyNextQuestion'];
        }
    }

    public async getNextQuestionFromAnswer() {
        const answer = this.getCurrentAnswer();

        if (this.currentQuestion.questionType === SurveyQuestionTypeEnum.groupedQuestion) {
            if (this.currentQuestion.idSurveyQuestionNext) {
                this.nextQuestionId = this.currentAnswer.idSurveyQuestionNext;
            }
            if (!this.nextQuestionId) {
                this.nextQuestionId = this.getNextSequencedQuestion();
            }
            if (answer.minOccurrence === 0
                && ((!answer.childSurveyAnswerList || answer.childSurveyAnswerList.length === 0))
                || (answer.childSurveyAnswerList && this.isGroupQuestionComplete())) {
                this.nextQuestionDisabled = false;
            } else {
                this.nextQuestionDisabled = true;
            }
        } else if (answer.answer) {
            if (answer.questionType === this.questionTypeEnum.choiceAnswer) {
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
        await this.surveyRepo.saveAnswers(this.controller.idInspection, this.inspectionQuestionAnswer);
    }

    private getCurrentAnswer() {
        let answer = Object.assign({}, this.currentAnswer);
        if (this.currentQuestion.questionType === SurveyQuestionTypeEnum.groupedQuestion) {
            if (this.currentQuestionAnswerList[0]) {
                answer = Object.assign({}, this.currentQuestionAnswerList[0]);
            }
        }
        return answer;
    }

    private isGroupQuestionComplete() {
        let retValue = false;
        if (this.currentQuestionAnswerList.length === 0) {
            return true;
        }
        this.currentQuestionAnswerList.forEach(answer => {
            if ((answer.childSurveyAnswerList &&
                answer.childSurveyAnswerList
                    .filter(ca => ca.idSurveyQuestionNext === '00000000-0000-0000-0000-000000000000'
                        && ca.answer).length > 0) || answer.childSurveyAnswerList.length === 0) {
                retValue = true;
            } else {
                retValue = false;
            }
        });
        return retValue;
    }

    private getNextSequencedQuestion() {
        let nextId = null;
        const nextSequencedQuestions = this.inspectionSurveyQuestion
            .filter(question => question.idParent == null && question.sequence > this.currentQuestion.sequence);
        if (nextSequencedQuestions.length > 0) {
            nextId = nextSequencedQuestions[0].idSurveyQuestion;
        }
        return nextId;
    }

    private getChoiceNextQuestionId(idChoiceSelected) {
        let idNext = '';
        const count = this.currentQuestion.choicesList.length;
        for (let index = 0; index < count; index++) {
            if (this.currentQuestion.choicesList[index].id === idChoiceSelected) {
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
        const answers = this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion === this.currentQuestion.idSurveyQuestion);
        if (answers.length > 0) {
            answers.forEach(answer => {
                if (answer.childSurveyAnswerList.length > 0) {
                    this.currentQuestionAnswerList.push(this.updateChildWithAnswered(answer));
                }
            });
        } else {
            for (let index = 0; index <= this.inspectionSurveyQuestion[this.selectedIndex].minOccurrence; index++) {
                this.inspectionQuestionAnswer.push(this.createGroupAnswerParent());
                await this.surveyRepo.saveAnswers(this.controller.idInspection, this.inspectionQuestionAnswer);
            }
            this.currentQuestionAnswerList = this.inspectionQuestionAnswer
                .filter(answer => answer.idSurveyQuestion === this.currentQuestion.idSurveyQuestion);
        }
    }

    private updateChildWithAnswered(answeredQuestion): InspectionSurveyAnswer {

        let mergedAnswered: InspectionSurveyAnswer = new InspectionSurveyAnswer();
        mergedAnswered = JSON.parse(JSON.stringify(this.inspectionSurveyQuestion[this.selectedIndex]));
        mergedAnswered.id = answeredQuestion.id;
        mergedAnswered.answer = answeredQuestion.answer;

        if (answeredQuestion.childSurveyAnswerList) {
            answeredQuestion.childSurveyAnswerList.forEach(answer => {
                const questionToAnswer = mergedAnswered.childSurveyAnswerList
                    .find((question) => question.idSurveyQuestion === answer.idSurveyQuestion);
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
        if (this.currentQuestion.questionType === SurveyQuestionTypeEnum.groupedQuestion) {
            await this.initQuestionGroupAnswers();
        } else {
            const answers = this.inspectionQuestionAnswer.filter(answer =>
                answer.idSurveyQuestion === this.currentQuestion.idSurveyQuestion);
            if (answers.length > 0) {
                this.currentAnswer = answers[0];
            } else {
                const newAnswer: InspectionSurveyAnswer = JSON.parse(JSON.stringify(this.inspectionSurveyQuestion[this.selectedIndex]));
                newAnswer.id = UUID.UUID();
                if (newAnswer.childSurveyAnswerList != null) {
                    newAnswer.childSurveyAnswerList.forEach(answer => answer.id = UUID.UUID());
                }
                this.inspectionQuestionAnswer.push(newAnswer);
                this.currentAnswer = this.inspectionQuestionAnswer
                    .filter(answer => answer.idSurveyQuestion === this.currentQuestion.idSurveyQuestion)[0];
            }
        }
    }

    public async addNewQuestionGroup() {
        if ((this.currentQuestionAnswerList.length < this.inspectionSurveyQuestion[this.selectedIndex].maxOccurrence)
            || this.inspectionSurveyQuestion[this.selectedIndex].maxOccurrence === 0) {
            let index = this.findLastAnswerForQuestion(this.currentQuestion.idSurveyQuestion);
            if (this.inspectionQuestionAnswer[index].childSurveyAnswerList.length === 0) {
              this.inspectionQuestionAnswer.splice(index, 1);
            } else {
                index++;
            }
            this.inspectionQuestionAnswer.splice(index, 0, this.createGroupAnswerParent(true));
            await this.surveyRepo.saveAnswers(this.controller.idInspection, this.inspectionQuestionAnswer);
            this.currentQuestionAnswerList = this.inspectionQuestionAnswer
                .filter(answer => answer.idSurveyQuestion === this.currentQuestion.idSurveyQuestion);
        }
        this.getNextQuestionFromAnswer();
    }

    public async deleteChildQuestion(answerId: string) {
        const index = this.findAnswerById(answerId);
        const answers = await this.inspectionQuestionAnswer.filter(answer =>
            answer.idSurveyQuestion === this.currentQuestion.idSurveyQuestion);
        if (answers.length > 0) {
            if (answers.length === 1) {
              this.inspectionQuestionAnswer.splice(index, 1);
              this.inspectionQuestionAnswer.splice(index, 0, this.createGroupAnswerParent());
            } else {
                this.inspectionQuestionAnswer.splice(index, 1);
            }
            await this.surveyRepo.saveAnswers(this.controller.idInspection, this.inspectionQuestionAnswer);
        } else {
            this.inspectionQuestionAnswer[index].childSurveyAnswerList =
                Object.assign([], this.currentQuestion.childSurveyAnswerList);
        }
        this.currentQuestionAnswerList = this.inspectionQuestionAnswer
            .filter(answer => answer.idSurveyQuestion === this.currentQuestion.idSurveyQuestion);
        this.getNextQuestionFromAnswer();
    }

    public async deleteRemainingAnswers(answerId: string) {
        const startIndex = this.findAnswerById(answerId) + 1;
        const ids = [];
        for (let index = startIndex; index < this.inspectionQuestionAnswer.length; index++) {
            if (this.inspectionQuestionAnswer[index].id) {
                ids.push(this.inspectionQuestionAnswer[index].id);
            }
        }
        if (ids.length > 0) {
            this.inspectionQuestionAnswer.splice(startIndex);
            await this.surveyRepo.saveAnswers(this.controller.idInspection, this.inspectionQuestionAnswer);
        }
    }

    public createGroupAnswerParent(userAdded = false) {
        const newAnswerParent = JSON.parse(JSON.stringify(this.inspectionSurveyQuestion[this.selectedIndex]));
        newAnswerParent.id = UUID.UUID();
        if (newAnswerParent.childSurveyAnswerList != null) {
            newAnswerParent.childSurveyAnswerList.forEach(answer => answer.id = UUID.UUID());
        }
        if (newAnswerParent.minOccurrence === 0 && !userAdded) {
            newAnswerParent.childSurveyAnswerList = [];
        }
        newAnswerParent.answer = 'Group header';
        return newAnswerParent;
    }

    private initAnswerStartQuestion() {
        const answerCount = this.inspectionQuestionAnswer.length;
        for (let index = 0; index < answerCount; index++) {
            if (this.inspectionQuestionAnswer[index].questionType === SurveyQuestionTypeEnum.groupedQuestion) {
                if (this.inspectionQuestionAnswer[index].childSurveyAnswerList) {
                    if (this.inspectionQuestionAnswer[index].childSurveyAnswerList.length > 0
                        && this.inspectionQuestionAnswer[index].childSurveyAnswerList
                        .filter(ca => ca.answer != null
                            && ca.idSurveyQuestionNext === '00000000-0000-0000-0000-000000000000').length === 0) {
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
