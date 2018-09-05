import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InspectionQuestion} from "../../models/inspection-question";

@Component({
    selector: 'parent-child-question',
    templateUrl: 'parent-child-question.html'
})
export class ParentChildQuestionComponent {
    @Input() questions: InspectionQuestion[] = [];
    @Output() childQuestionAnswered = new EventEmitter<any>();

    public currentQuestion: InspectionQuestion;
    public answeredQuestions: InspectionQuestion[] = [];

    constructor() {
        this.loadAnsweredQuestion();
    }

    private loadAnsweredQuestion() {
        this.answeredQuestions = this.questions.filter((question) => question.answer != "");
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
