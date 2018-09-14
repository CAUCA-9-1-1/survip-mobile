import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {InspectionSurveyAnswer, SurveyQuestionTypeEnum} from "../../models/inspection-survey-answer";
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {InspectionSurveyAnswerRepositoryProvider} from "../../providers/repositories/inspection-survey-answer-repository-provider";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {TranslateService} from "@ngx-translate/core";
import {UUID} from "angular2-uuid";

@Component({
    selector: 'parent-child-question',
    templateUrl: 'parent-child-question.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: ParentChildQuestionComponent, multi: true}
    ]
})
export class ParentChildQuestionComponent {
    @ViewChild("questionGroup") questionGroup: ElementRef;
    @Input() answer: InspectionSurveyAnswer;
    @Output() questionAnswered = new EventEmitter<any>();
    @Output() answerGroupDeleted = new EventEmitter<any>();
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
        if(!this.answer.id){
            this.answer.id = UUID.UUID();
        }
        this.answeredQuestions = this.answer.childSurveyAnswerList.filter((answer) => answer.answer != null && answer.answer != "");
        if (this.answeredQuestions.length == 0) {
            this.answeredQuestions.push(this.answer.childSurveyAnswerList[0]);
        } else {
            this.questionIndex = this.answer.childSurveyAnswerList.filter((answer)=> answer.answer != null && answer.answer != "").length - 1;
            this.getNextQuestion();
        }
    }

    private validateLastQuestionAnswer() {
        const nextId = this.getNextQuestionId();
        if (nextId == this.answer.idSurveyQuestion) {
            this.questionAnswered.emit(this.answer);
        } else {
            this.getNextQuestion(nextId);
        }
    }

    private getNextQuestion(nextQuestionId?: string) {
        let nextId = nextQuestionId;
        if (!nextId) {
            nextId = this.getNextQuestionId();
        }
        let NextQuestion = this.answer.childSurveyAnswerList.filter((question) => question.idSurveyQuestion == nextId);
        if (NextQuestion.length > 0) {
            this.answeredQuestions.push(NextQuestion[0]);
            this.questionIndex++;
        }
    }

    private getNextQuestionId(): string {
        let retVal = this.answeredQuestions[this.questionIndex].idSurveyQuestionNext;
        if (this.answeredQuestions[this.questionIndex].answer) {
            if (this.answeredQuestions[this.questionIndex].questionType == SurveyQuestionTypeEnum.choiceAnswer) {
                const childIndex = this.getQuestionIndex();
                const questionChoice = this.answer.childSurveyAnswerList[childIndex].choicesList.filter(choice => choice.id == this.answeredQuestions[this.questionIndex].idSurveyQuestionChoice);
                if (questionChoice.length > 0 && questionChoice[0].idSurveyQuestionNext) {
                    retVal = questionChoice[0].idSurveyQuestionNext;
                }
            }
        }
        return retVal;
    }

    private getQuestionIndex(){
        const questionCount = this.answer.childSurveyAnswerList.length;
        for (let index = 0; index < questionCount; index++) {
            if (this.answer.childSurveyAnswerList[index].idSurveyQuestion == this.answeredQuestions[this.questionIndex].idSurveyQuestion) {
                return index;
            }
        }
    }

    public validateAnswer(answer) {
        this.saveParentAnswer();
        this.validateLastQuestionAnswer();
    }

    public async deleteQuestionGroup() {
        let canDelete = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyDeleteQuestionGroup']);
        if (canDelete) {

            let Ids = [this.answer.id];
            this.answeredQuestions.forEach(answer => {
                if (answer.id) {
                    Ids.push(answer.id);
                }
            });
            this.surveyRepo.deleteSurveyAnswers(Ids)
                .subscribe(() => {
                    this.answerGroupDeleted.emit(this.answer.id);
                }, () => {
                    this.answerGroupDeleted.emit(this.answer.id);
                });
        }
    }

    public manageQuestionGroupDisplay() {
        if (this.questionGroup.nativeElement.style.display == 'none') {
            this.questionGroup.nativeElement.style.display = 'block';
        } else {
            this.questionGroup.nativeElement.style.display = 'none';
        }
    }

    private saveParentAnswer() {
        if (!this.answer.answer) {
            this.answer.answer = "Group completed";
            this.surveyRepo.answerQuestion(this.answer).subscribe();
        }
    }
}
