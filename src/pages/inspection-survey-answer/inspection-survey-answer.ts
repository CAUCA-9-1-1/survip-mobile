import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {InspectionSurveyAnswer, SurveyQuestionTypeEnum} from "../../models/inspection-survey-answer";
import {InspectionSurveyAnswerRepositoryProvider} from "../../providers/repositories/inspection-survey-answer-repository-provider";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
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
    public previousQuestionAvailable = false;
    public nextQuestionDisabled = false;
    public nextButtonTitle: string = 'Suivante';
    public nextQuestionId: string = '';
    public labels = {};
    public currentQuestionAnswerList : InspectionSurveyAnswer[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public controller: InspectionSurveyAnswerRepositoryProvider,
                private messageTools: MessageToolsProvider,
                private translateService: TranslateService,
                private inspectionController: InspectionControllerProvider) {

        this.idInspection = this.navParams.get('idInspection');
        this.inspectionSurveyCompleted = this.navParams.get('inspectionSurveyCompleted');
        this.loadInspectionQuestion();
    }

    public ngOnInit() {
        this.translateService.get([
            'surveyCompletedMessage', 'surveyNextQuestion', 'complete','surveyDeleteQuestionGroup','confirmation'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
        this.nextButtonTitle = this.labels['surveyNextQuestion'];
    }

    public loadInspectionQuestion() {
        this.controller.getQuestionList(this.idInspection)
            .subscribe(result => {
                    this.inspectionSurveyQuestion = result;
                    this.loadInspectionAnswer();
                },
                error => {
                    this.messageTools.showToast('Une erreur est survenue lors du chargement du questionnaire veuillez réessayer ultérieurement.', 5);
                    this.navCtrl.pop();
                });
    }

    public loadInspectionAnswer() {
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
                this.initiateQuestionGroup();

                this.getNextQuestionFromAnswer();
            });
    }

    public findQuestion(idSurveyQuestion: string) {
        const questionCount = this.inspectionSurveyQuestion.length;
        for (let index = 0; index < questionCount; index++) {
            if (this.inspectionSurveyQuestion[index].idSurveyQuestion == idSurveyQuestion && (!this.inspectionSurveyQuestion[index].answer)) {
                return index;
            }
        }
    }


    public completeInspectionQuestion() {
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

    public previousQuestion(){
        this.currentQuestion = this.inspectionQuestionAnswer[this.selectedIndex-1];
        this.initiateQuestionGroup();
    }

    public nextQuestion(){
        this.currentQuestion = this.inspectionSurveyQuestion[this.selectedIndex + 1];
        this.initiateQuestionGroup();
    }

    public validateQuestionAnswer(){
        if(this.inspectionSurveyQuestion[this.selectedIndex].questionType != this.questionTypeEnum.groupedQuestion){
            this.getNextQuestionFromAnswer() ;
        }
    }
    public getNextQuestionFromAnswer() {

        if (this.currentQuestion.answer) {
            if (this.currentQuestion.questionType == this.questionTypeEnum.choiceAnswer) {
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
    }

    public getChoiceNextQuestionId(idChoiceSelected) {
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



    public addNewAnswer(questionIndex: number) {
        let newAnswer = Object.assign({}, this.inspectionSurveyQuestion[questionIndex]);
        this.inspectionQuestionAnswer.push(newAnswer);
    }


    public ionViewWillLeave() {
        if(this.navCtrl.getPrevious().name == "InterventionHomePage"){
            this.inspectionController.loadInterventionForm();
        }
    }

    public initiateQuestionGroup(){
        this.currentQuestionAnswerList = [];
        if(this.currentQuestion.answer) {
            this.currentQuestionAnswerList = this.inspectionQuestionAnswer.filter(answer => answer.idSurveyQuestion == this.currentQuestion.idSurveyQuestion);
        } else {
            for (let index = 0; index < this.inspectionSurveyQuestion[this.selectedIndex].minOccurrence; index++) {
                this.currentQuestionAnswerList.push(this.inspectionSurveyQuestion[this.selectedIndex]);
            }
        }
    }

    public async addNewQuestionGroup(){
        if (this.currentQuestionAnswerList.length < this.inspectionSurveyQuestion[this.selectedIndex].maxOccurrence) {
            this.currentQuestionAnswerList.push(this.inspectionSurveyQuestion[this.selectedIndex]);
        }
    }

    public deleteChildQuestion(index:number){
        this.currentQuestionAnswerList.splice(index,1);
    }

}
