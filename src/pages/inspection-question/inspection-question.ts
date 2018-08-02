import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {InspectionQuestion} from "../../models/inspection-question";
import {InspectionQuestionRepositoryProvider} from "../../providers/repositories/inspection-question-repository-provider";
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-inspection-question',
    templateUrl: 'inspection-question.html',
})
export class InspectionQuestionPage {
    @ViewChild(Slides) slides: Slides;

    inspectionQuestionAnswer: InspectionQuestion[] = [];
    inspectionQuestion: InspectionQuestion[] = [];
    idInspection: string = '';
    inspectionSurveyCompleted: boolean = false;
    selectedIndex = 0;
    currentQuestion: InspectionQuestion = new InspectionQuestion();
    previousQuestionAvailable = false;
    nextQuestionDisabled = false;
    questionTypeEnum = {'MultipleChoice': 1, 'TextAnswer': 2, 'DateAnswer': 3};
    nextButtonTitle: string = 'Suivante';
    nextQuestionId: string = '';
    reviewOnly = false;
    changingValueTimer = null;
    labels = {};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public controller: InspectionQuestionRepositoryProvider,
                private authService: AuthenticationService,
                private messageTools: MessageToolsProvider,
                private translateService: TranslateService) {

        this.idInspection = this.navParams.get('idInspection');
        this.inspectionSurveyCompleted = this.navParams.get('inspectionSurveyCompleted')
        this.loadInspectionQuestion();
    }

    ngOnInit() {
        this.translateService.get([
            'surveyCompletedMessage', 'surveyNextQuestion', 'complete'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
        this.nextButtonTitle = this.labels['surveyNextQuestion'];
    }

    async ionViewCanEnter() {
        let isLoggedIn = await this.authService.isStillLoggedIn();
        if (!isLoggedIn)
            this.redirectToLoginPage();
    }

    private redirectToLoginPage() {
        this.navCtrl.setRoot('LoginPage');
    }

    ionViewDidLoad() {
        this.slides.lockSwipes(true);
    }

    loadInspectionQuestion() {
        this.controller.getQuestionList(this.idInspection)
            .subscribe(result => {
                    this.inspectionQuestion = result;
                    this.loadInspectionAnswer();
                },
                error => {
                    this.messageTools.showToast('Une erreur est survenue lors du chargement du questionnaire veuillez réessayer ultérieurement.', 5);
                    this.navCtrl.pop();
                });
    }

    loadInspectionAnswer() {
        this.controller.getAnswerList(this.idInspection)
            .subscribe(answerResult => {
                this.inspectionQuestionAnswer = answerResult;

                if (this.inspectionQuestionAnswer.length > 0) {
                    if (!this.inspectionSurveyCompleted) {
                        this.selectedIndex = this.inspectionQuestionAnswer.length - 1;
                    }
                } else {
                    this.addNewAnswer(this.selectedIndex);
                }
                this.currentQuestion = this.inspectionQuestionAnswer[this.selectedIndex];
                this.canSwitchQuestion();
                this.getNextQuestionFromAnswer();
            });
    }


    switchQuestion() {
        this.selectedIndex = this.slides.getActiveIndex();
        this.currentQuestion = this.inspectionQuestionAnswer[this.selectedIndex];
        this.getNextQuestionFromAnswer();
        this.canSwitchQuestion();
    }

    canSwitchQuestion() {
        let retValue = true;
        if (this.currentQuestion.answer) {
            this.nextQuestionDisabled = false;
            this.reviewOnly = true;
        } else {
            this.nextQuestionDisabled = true;
            this.reviewOnly = false;
            retValue = false;
        }

        return retValue;
    }

    findQuestion(idSurveyQuestion: string) {
        const questionCount = this.inspectionQuestion.length;
        for (let index = 0; index < questionCount; index++) {
            if (this.inspectionQuestion[index].idSurveyQuestion == idSurveyQuestion && (!this.inspectionQuestion[index].answer)) {
                return index;
            }
        }
    }

    isNextQuestionExists() {
        let nextExists = false;
        const questionCount = this.currentQuestion.choicesList.length;
        for (let index = 0; index < questionCount; index++) {
            if (this.currentQuestion.choicesList[index].idSurveyQuestionNext) {
                nextExists = true;
                break;
            }
        }
        if (!nextExists) {
            if (this.currentQuestion.idSurveyQuestionNext) {
                nextExists = true;
            }
        }
        return nextExists;
    }

    nextQuestion() {
        if (this.nextQuestionId) {
            let nextIndex = this.findQuestion(this.nextQuestionId);

            if (!this.inspectionQuestionAnswer[this.selectedIndex + 1]) {
                this.addNewAnswer(nextIndex);
            }
            this.slides.lockSwipes(false);
            this.slides.slideTo(this.selectedIndex + 1);
            this.switchQuestion();
            this.slides.lockSwipes(true);

        } else {
            this.completeInspectionQuestion();
        }
    }

    completeInspectionQuestion() {
        this.controller.CompleteSurvey(this.idInspection)
            .subscribe(result => {

                    this.messageTools.showToast(this.labels['surveyCompletedMessage'], 3);
                    setTimeout(() => {
                        this.navCtrl.push('InspectionQuestionSummaryPage', {idInspection: this.idInspection});
                    }, 3000);

                },
                error => {
                    this.messageTools.showToast('Une erreur est survenue lors de la finalisation du questionnaire, veuillez réessayer ultérieurement.', 3);
                })
        ;
    }

    previousQuestion() {
        this.slides.lockSwipes(false);
        this.slides.slideTo(this.selectedIndex - 1);
        this.switchQuestion();
        this.slides.lockSwipes(true);
    }

    getNextQuestionFromAnswer() {
        if (this.currentQuestion.answer) {
            if (this.currentQuestion.questionType == this.questionTypeEnum.MultipleChoice) {
                this.currentQuestion.idSurveyQuestionChoice = this.currentQuestion.answer;
                this.nextQuestionId = this.getChoiceNextQuestionId(this.currentQuestion.idSurveyQuestionChoice);
                if (!this.nextQuestionId) {
                    this.nextQuestionId = this.currentQuestion.idSurveyQuestionNext;
                }
            } else {
                this.nextQuestionId = this.currentQuestion.idSurveyQuestionNext;
            }
            this.nextQuestionDisabled = false;
        } else {
            this.nextQuestionDisabled = true;
            this.nextQuestionId = null;
        }
        this.questionNavigationDisplay();
    }

    answerTextChanged() {
        if (this.changingValueTimer) {
            clearTimeout(this.changingValueTimer);
        }
        this.changingValueTimer = setTimeout(() => {
            this.getNextQuestionFromAnswer();
        }, 1500);
    }

    getChoiceNextQuestionId(idChoiceSelected) {
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

    questionNavigationDisplay() {
        if (this.selectedIndex > 0) {
            this.previousQuestionAvailable = true;
        } else {
            this.previousQuestionAvailable = false;
        }

        if (this.nextQuestionId || this.isNextQuestionExists()) {
            this.nextButtonTitle = this.labels['surveyNextQuestion'];
        } else {
            this.nextButtonTitle = this.labels['complete'];
        }
    }

    createAnswer() {
        const newAnswer = new InspectionQuestion();
        newAnswer.id = this.currentQuestion.id;
        newAnswer.idInspection = this.currentQuestion.idInspection;
        newAnswer.idSurveyQuestion = this.currentQuestion.idSurveyQuestion;
        newAnswer.answer = this.currentQuestion.answer;
        newAnswer.idSurveyQuestionChoice = this.currentQuestion.idSurveyQuestionChoice;
        return newAnswer;
    }

    addNewAnswer(questionIndex: number) {
        let newAnswer = Object.assign({}, this.inspectionQuestion[questionIndex]);
        this.inspectionQuestionAnswer.push(newAnswer);
        this.slides.update();
    }

    saveAnswer() {
        if (this.currentQuestion.answer) {
            const answer = this.createAnswer();
            this.controller.answerQuestion(answer)
                .subscribe(result => {
                        this.currentQuestion.id = result['id'];
                        this.nextQuestion();
                    },
                    error => {
                        this.messageTools.showToast('Une erreur est survenue lors de la sauvegarde de votre réponse veuillez recommencer ultérieurement.', 5);
                    });
        }
    }

}
