import {Component, EventEmitter, Input, Output} from '@angular/core';
import {InspectionSurveyAnswer, SurveyQuestionTypeEnum} from "../../models/inspection-survey-answer";
import {InspectionSurveyAnswerRepositoryProvider} from "../../providers/repositories/inspection-survey-answer-repository-provider";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";

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
    @Output() remainingQuestionResetNeeded = new EventEmitter<any>();
    @Input() idParent = null;

    public questionTypeEnum = SurveyQuestionTypeEnum;
    private changingValueTimer = null;
    private originalQuestion: InspectionSurveyAnswer;
    private labels

    constructor(private questionRepo: InspectionSurveyAnswerRepositoryProvider,
                private msgTools: MessageToolsProvider,
                private translateService: TranslateService) {

    }

    ngOnInit(){
        this.originalQuestion = Object.assign( new InspectionSurveyAnswer(),this.question);
        this.translateService.get([
            'surveyChangingAnswerQuestion', 'confirmation'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public validateAnswer() {
        if(this.validateNextQuestionSequence())
        if (this.question.answer) {
            if(this.question.questionType == this.questionTypeEnum.choiceAnswer){
                this.question.idSurveyQuestionChoice = this.question.answer;
            }
            this.saveAnswer();
        }
    }

    public textAnswerChanged() {
        if (this.changingValueTimer) {
            clearTimeout(this.changingValueTimer);
        }
        this.changingValueTimer = setTimeout(() => {
            this.saveAnswer();
        }, 1500);
    }

    private saveAnswer() {
        if(this.idParent){
            this.question.idParent = this.idParent;
        }
        this.questionRepo.answerQuestion(this.question)
            .subscribe(result => {
                    this.question.id = result['id'];
                    this.questionAnswered.emit(this.question);
                },
                error => {
                    console.log("Erreur lors de la sauvegarde de la réponse.");
                });
    }

    private async validateNextQuestionSequence() {
        if(this.nextQuestionChanged()){
            let canDelete = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyChangingAnswerQuestion']);
            if (canDelete) {
                this.remainingQuestionResetNeeded.emit(this.question.id)
                return true;
            }
            return false;
        }
        return true;
    }
    private nextQuestionChanged(){
        let retValue = false;
        if(this.originalQuestion.answer) {
            if (this.question.idSurveyQuestionNext != this.originalQuestion.idSurveyQuestionNext) {
                retValue = true;
            }
            if(this.question.questionType == SurveyQuestionTypeEnum.choiceAnswer) {
                retValue =  this.nextQuestionFromChoiceChanged();
            }
        }
        return retValue;
    }

    private nextQuestionFromChoiceChanged(){
        let NewChoice = this.question.choicesList.filter((choice)=> choice.id == this.question.idSurveyQuestionChoice);
        const originalChoice = this.question.choicesList.filter((choice)=> choice.id == this.originalQuestion.idSurveyQuestionChoice);

        if(NewChoice[0].idSurveyQuestionNext != originalChoice[0].idSurveyQuestionNext){
            return true;
        }
        return false
    }
}
