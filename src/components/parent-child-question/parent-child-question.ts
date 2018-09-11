import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InspectionSurveyAnswer} from "../../models/inspection-survey-answer";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'parent-child-question',
    templateUrl: 'parent-child-question.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: ParentChildQuestionComponent, multi: true}
    ]
})
export class ParentChildQuestionComponent {
    @Input() question: InspectionSurveyAnswer;
    @Output() childQuestionAnswered = new EventEmitter<any>();

    public answeredQuestions: InspectionSurveyAnswer[] = [];
    public questionIndex = 0;

    constructor() {

    }

    public ngOnInit(){
        this.loadAnsweredQuestion();
    }

    private loadAnsweredQuestion() {
        this.answeredQuestions = this.question.childSurveyAnswerList.filter((question) => question.answer != "" && question.answer != null);
        if(this.answeredQuestions.length == 0){
            const newQuestion = Object.assign({}, this.question.childSurveyAnswerList[this.questionIndex]);
            this.answeredQuestions.push(newQuestion);
        }else{
            this.getNextQuestion();
        }
    }

    private validateLastQuestionAnswer() {
        if (this.answeredQuestions[this.questionIndex].idSurveyQuestion == this.question.childSurveyAnswerList[this.question.childSurveyAnswerList.length - 1].idSurveyQuestion) {
            this.childQuestionAnswered.emit(null);
        }else{
            this.getNextQuestion();
        }
    }

    private getNextQuestion(){
        const NextQuestion = this.question.childSurveyAnswerList.filter((question) => question.idSurveyQuestion == this.answeredQuestions[this.questionIndex].idSurveyQuestionNext);
        this.answeredQuestions.push(NextQuestion[0]);
    }

    public validateAnswer(answer) {
        this.validateLastQuestionAnswer();
    }

    public AddNewQuestionGroup(){
        const NewQuestionGroup = this.question.childSurveyAnswerList.filter((question) => question.answer != "" && question.answer != null);
        this.answeredQuestions.push.apply(NewQuestionGroup);
    }

}
