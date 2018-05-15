import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {InspectionQuestion} from "../../models/inspection-question";
import {InspectionQuestionRepositoryProvider} from "../../providers/repositories/inspection-question-repository-provider";

@IonicPage()
@Component({
    selector: 'page-inspection-question',
    templateUrl: 'inspection-question.html',
})
export class InspectionQuestionPage {
    @ViewChild(Slides) slides: Slides;

    public inspectionQuestionAnswer: InspectionQuestion[] = [];
    public inspectionQuestion: InspectionQuestion[] = [];
    public idInspection: string = '';
    public selectedIndex = 0;
    public currentQuestion: InspectionQuestion = new InspectionQuestion();
    public previousQuestionAvailable = true;
    public nexQuestionDisabled = true;
    public questionTypeEnum = {'MultipleChoice': 1, 'TextAnswer': 2, 'DateAnswer': 3};
    public nextButtonTitle: string = 'Suivante';
    public nextQuestionId: string = '';
    public reviewOnly = false;


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public controller: InspectionQuestionRepositoryProvider,
    ) {
        this.idInspection = this.navParams.get('idInspection');
        this.loadInspectionQuestion();
    }

    ionViewDidLoad() {
        this.slides.lockSwipes(true);
        this.questionNavigationDisplay();
    }

    loadInspectionQuestion() {
        this.controller.getList(this.idInspection)
            .subscribe(result => {
                this.inspectionQuestion = result;
                this.inspectionQuestionAnswer.push(Object.assign([], result[this.selectedIndex]));
                this.currentQuestion = this.inspectionQuestionAnswer[this.selectedIndex];
                this.nextQuestionId = this.currentQuestion.idSurveyQuestionNext;
                if (this.currentQuestion.answer) {
                    this.checkAlreadyAnswered();
                }
            });
    }

    switchQuestion() {
        this.selectedIndex = this.slides.getActiveIndex();
        this.currentQuestion = this.inspectionQuestionAnswer[this.selectedIndex];
    }

    findQuestion(idSurveyQuestion: string) {
        if (this.reviewOnly)
            return this.selectedIndex + 1;

        const questionCount = this.inspectionQuestion.length;
        for (let index = 0; index < questionCount; index++) {
            if (this.inspectionQuestion[index].idSurveyQuestion == idSurveyQuestion) {
                return index;
            }
        }
    }

    nextQuestion() {
        this.slides.lockSwipes(false);

        this.checkAlreadyAnswered();

        if (this.nextQuestionId != '') {
            let nextIndex = this.findQuestion(this.nextQuestionId);

            if (!this.inspectionQuestionAnswer[this.selectedIndex + 1]) {
                this.addNewAnswer(nextIndex);
            }

            this.slides.slideTo(this.selectedIndex + 1);
            this.switchQuestion();
            this.slides.lockSwipes(true);
            this.questionNavigationDisplay();
        } else {
            this.navCtrl.pop();
        }
    }

    checkAlreadyAnswered() {
        if (this.inspectionQuestion[this.selectedIndex + 1]) {
            if (this.inspectionQuestion[this.selectedIndex + 1].answer) {
                this.reviewOnly = true;
                this.answerChanged();
            } else {
                this.reviewOnly = false;
            }
        }
    }

    previousQuestion() {
        this.slides.lockSwipes(false);
        this.slides.slidePrev();
        this.switchQuestion();
        this.slides.lockSwipes(true);
        this.questionNavigationDisplay();
    }

    answerChanged() {
        if (this.currentQuestion.questionType == this.questionTypeEnum.MultipleChoice) {
            if (this.currentQuestion.answer != '') {
                this.nextQuestionId = this.getChoiceNextQuestionId(this.currentQuestion.answer);
                if (this.nextQuestionId == '') {
                    this.nextQuestionId = this.currentQuestion.idSurveyQuestionNext;
                }
                this.nexQuestionDisabled = false;
            }
        } else {
            this.nextQuestionId = this.currentQuestion.idSurveyQuestionNext;
        }
        this.questionNavigationDisplay();
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

        if (this.nextQuestionId) {
            this.nextButtonTitle = 'Suivante';
        } else {
            this.nextButtonTitle = 'Terminer';
        }
    }

    saveAnswer(navigation) {

        if (this.currentQuestion.answer) {
            const answer = this.createAnswer();
            this.controller.answerQuestion(answer)
                .subscribe(result => {
                        this.currentQuestion.id = result['id'];
                        this.nextQuestion();
                    },
                    error => {
                        console.log('Erreur lors de la sauvegarde de la réponse');
                    });
        }
    }

    getAnswerFromQuestionType() {
        let answer = this.currentQuestion.answer;
        if (this.currentQuestion.questionType == this.questionTypeEnum.MultipleChoice) {
            answer = this.currentQuestion.idSurveyQuestionChoice;
        }
        return answer;
    }

    createAnswer() {
        const newAnswer = new InspectionQuestion();
        newAnswer.id = this.currentQuestion.id;
        newAnswer.idInspection = this.currentQuestion.idInspection;
        newAnswer.idSurveyQuestion = this.currentQuestion.idSurveyQuestion;
        newAnswer.answer = this.currentQuestion.answer;
        if (this.currentQuestion.questionType == this.questionTypeEnum.MultipleChoice) {
            this.currentQuestion.idSurveyQuestionChoice = this.currentQuestion.answer;
            newAnswer.idSurveyQuestionChoice = this.currentQuestion.idSurveyQuestionChoice;
        }
        return newAnswer;
    }

    addNewAnswer(questionIndex: number) {
        let newAnswer = Object.assign({}, this.inspectionQuestion[questionIndex]);
        this.inspectionQuestionAnswer.push(newAnswer);
        this.slides.update();
    }

}
