import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
    InspectionSurveyAnswer,
    SurveyQuestionTypeEnum
} from "../../models/inspection-survey-answer";
import {InspectionSurveyAnswerRepositoryProvider} from "../../providers/repositories/inspection-survey_answer-repository-provider";
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'survey-question',
    templateUrl: 'survey-question.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: SurveyQuestionComponent, multi: true}
    ]
})
export class SurveyQuestionComponent {
    @Input() question: InspectionSurveyAnswer;
    @Input() showTitle = true;
    @Output() questionAnswered = new EventEmitter<any>();

    public questionTypeEnum = SurveyQuestionTypeEnum;

    constructor(private questionRepo: InspectionSurveyAnswerRepositoryProvider) {

    }

    ngOnInit(){
        console.log("survey question component : ",this.question);
    }

    public validateAnswer() {
        if (this.question.answer) {
            if(this.question.questionType == this.questionTypeEnum.choiceAnswer){
                this.question.idSurveyQuestionChoice = this.question.answer;
            }
            this.saveAnswer();
        }
    }

    saveAnswer() {
        this.questionRepo.answerQuestion(this.question)
            .subscribe(result => {
                    this.question.id = result['id'];
                    this.questionAnswered.emit(this.question);
                },
                error => {
                    console.log("Erreur lors de la sauvegarde de la réponse.");
                });
    }
}
