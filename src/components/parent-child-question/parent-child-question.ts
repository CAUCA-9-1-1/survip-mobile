import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {InspectionSurveyAnswer, SurveyQuestionTypeEnum} from "../../models/inspection-survey-answer";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {InspectionSurveyAnswerRepositoryProvider} from "../../providers/repositories/inspection-survey-answer-repository-provider";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'parent-child-question',
    templateUrl: 'parent-child-question.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: ParentChildQuestionComponent, multi: true}
    ]
})
export class ParentChildQuestionComponent {
    @ViewChild("questionGroup") questionGroup: ElementRef;
    @Input() question: InspectionSurveyAnswer;
    @Input() answer: InspectionSurveyAnswer;
    @Output() childQuestionAnswered = new EventEmitter<any>();
    @Output() childQuestionDeleted = new EventEmitter<any>();
    @Input() groupIndex = 1;

    public answeredQuestions: InspectionSurveyAnswer[] = [];
    public questionIndex = 0;
    public labels = {};

    constructor(private surveyRepo: InspectionSurveyAnswerRepositoryProvider, private msgTools: MessageToolsProvider,
                private translateService: TranslateService) {

    }

    public ngOnInit() {
        this.translateService.get([
            'surveyDeleteQuestionGroup', 'confirmation'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
        this.loadAnsweredQuestion();
    }

    private loadAnsweredQuestion() {
        this.answeredQuestions = this.answer.childSurveyAnswerList.filter((question) => question.answer != null && question.answer != "");
        if(this.answeredQuestions.length == 0){
            this.answeredQuestions.push(this.question.childSurveyAnswerList[0]);
        }else {
            this.getNextQuestion();
        }
    }

    private validateLastQuestionAnswer() {
        const nextId = this.getNextQuestionId();
        if (nextId == this.question.idSurveyQuestion) {
            this.childQuestionAnswered.emit(null);
        }else{
            this.getNextQuestion(nextId);
        }
    }

    private getNextQuestion(nextQuestionId?: string) {
        let nextId = nextQuestionId;
        if(!nextId){
            nextId = this.getNextQuestionId();
        }
        const NextQuestion = this.question.childSurveyAnswerList.filter((question) => question.idSurveyQuestion == nextId);
        this.answeredQuestions.push(NextQuestion[0]);
        this.questionIndex++;
    }

    private getNextQuestionId(): string{
        let retVal = this.answeredQuestions[this.questionIndex].idSurveyQuestionNext;
        if(this.answeredQuestions[this.questionIndex].answer) {
            if (this.answeredQuestions[this.questionIndex].questionType == SurveyQuestionTypeEnum.choiceAnswer) {
                const questionChoice = this.question.childSurveyAnswerList[this.questionIndex].choicesList.filter(choice => choice.id == this.answeredQuestions[this.questionIndex].idSurveyQuestionChoice);
                if (questionChoice.length > 0 && questionChoice[0].idSurveyQuestionNext) {
                    retVal = questionChoice[0].idSurveyQuestionNext;
                }
            }
        }
        return retVal;
}

    public validateAnswer(answer) {
        this.saveParentAnswer();
        this.validateLastQuestionAnswer();
    }

    public async deleteQuestionGroup() {
        let canDelete = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyDeleteQuestionGroup']);
        if (canDelete) {

            this.surveyRepo.deleteSurveyAnswers(this.answeredQuestions)
                .subscribe(()=>
                {
                    this.childQuestionDeleted.emit(this.groupIndex);
                    },()=>
                {
                    this.childQuestionDeleted.emit(this.groupIndex);
                });
        }
    }

    public hideExpandGroup(){
        if(this.questionGroup.nativeElement.style.display == 'none'){
            this.questionGroup.nativeElement.style.display = 'block';
        }else{
        this.questionGroup.nativeElement.style.display = 'none';}
    }

    private saveParentAnswer(){
        if(!this.question.answer) {
            this.question.answer = "child completed";
            this.surveyRepo.answerQuestion(this.question).subscribe();
        }
    }
}
