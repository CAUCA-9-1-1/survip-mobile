import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InspectionQuestion} from "../../models/inspection-question";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'parent-child-question',
    templateUrl: 'parent-child-question.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: ParentChildQuestionComponent, multi: true}
    ]
})
export class ParentChildQuestionComponent {
    @Input() questions: InspectionQuestion[] = [];
    @Output() childQuestionAnswered = new EventEmitter<any>();

    public currentQuestion: InspectionQuestion;
    public answeredQuestions: InspectionQuestion[] = [];


    constructor() {
    }

    public ngOnInit(){
        console.log("parent survey question component : ",this.questions);
    }

    private loadAnsweredQuestion() {
        this.answeredQuestions = this.questions.filter((question) => question.answer != "");
        if(this.answeredQuestions.length == 0){

        }
    }

    private validateLastQuestionAnswer() {
        if (this.currentQuestion.id == this.questions[this.questions.length - 1].id) {
            this.childQuestionAnswered.emit(null);
        }
    }

    public showNextQuestion() {
        this.validateLastQuestionAnswer();

    }


}
