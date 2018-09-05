import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InspectionQuestion} from "../../models/inspection-question";
import {InspectionQuestionRepositoryProvider} from "../../providers/repositories/inspection-question-repository-provider";

@Component({
    selector: 'survey-question',
    templateUrl: 'survey-question.html'
})
export class SurveyQuestionComponent {
    @Input() question: InspectionQuestion;
    @Output() questionAnswered = new EventEmitter<any>();


    constructor(private questionRepo: InspectionQuestionRepositoryProvider) {
    }

    public ValidateAnswer(e: InspectionQuestion) {
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
