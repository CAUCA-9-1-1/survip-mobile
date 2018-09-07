import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InspectionQuestion} from "../../models/inspection-question";
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
    @Input() question: InspectionQuestion;
    @Input() showTitle = true;
    @Output() questionAnswered = new EventEmitter<any>();

    constructor(private questionRepo: InspectionSurveyAnswerRepositoryProvider) {

    }

    ngOnInit(){
        console.log("survey question component : ",this.question);
    }

    public ValidateAnswer() {
        if (this.question.answer) {
            this.saveAnswer();
        }
    }

    saveAnswer() {
        this.questionRepo.answerQuestion(this.question)
            .subscribe(result => {
                    this.question.id = result['id'];
                    this.questionAnswered.emit(null);
                },
                error => {
                    console.log("Erreur lors de la sauvegarde de la réponse.");
                });
    }
}
