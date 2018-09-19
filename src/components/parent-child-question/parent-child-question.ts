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
    @Input() answer: InspectionSurveyAnswer;
    @Output() questionAnswered = new EventEmitter<any>();
    @Output() groupAnswersCompleted = new EventEmitter<any>();
    @Output() answerGroupDeleted = new EventEmitter<any>();
    @Input() groupIndex = 1;

    public answeredQuestions: InspectionSurveyAnswer[] = [];
    public questionIndex = 0;
    public labels = {};
    public groupIcon = "md-arrow-dropdown";

    constructor(private surveyRepo: InspectionSurveyAnswerRepositoryProvider, private msgTools: MessageToolsProvider,
                private translateService: TranslateService) {
        this.groupIcon = "md-arrow-dropdown";
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
            this.groupAnswersCompleted.emit(this.answer);
        } else {
            this.getNextQuestion(nextId);
        }
    }

    private getNextQuestion(nextQuestionId?: string) {
        let nextId = nextQuestionId;
        if (!nextId) {
            nextId = this.getNextQuestionId();
        }
        let NextQuestion = this.answer.childSurveyAnswerList.find((question) => question.idSurveyQuestion == nextId);
        if (NextQuestion) {
            this.answeredQuestions.push(NextQuestion);
            this.questionIndex++;
        }
    }

    private getNextQuestionId(): string {
        let retVal = this.answeredQuestions[this.questionIndex].idSurveyQuestionNext;
        if (this.answeredQuestions[this.questionIndex].answer) {
            if (this.answeredQuestions[this.questionIndex].questionType == SurveyQuestionTypeEnum.choiceAnswer) {
                const childIndex = this.getQuestionIndex();
                const questionChoice = this.answer.childSurveyAnswerList[childIndex].choicesList.find(choice => choice.id == this.answeredQuestions[this.questionIndex].idSurveyQuestionChoice);
                if (questionChoice && questionChoice.idSurveyQuestionNext) {
                    retVal = questionChoice.idSurveyQuestionNext;
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

    public validateAnswer() {
        this.questionAnswered.emit(this.answer);
        this.validateLastQuestionAnswer();
    }

    public async deleteQuestionGroup() {
        let canDelete = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyDeleteQuestionGroup']);
        if (canDelete) {
            let ids = [];
            this.answeredQuestions.forEach(answer => {
                if (answer.id) {
                    ids.push(answer.id);
                }
            });
            if(ids.length > 0) {
                this.surveyRepo.deleteSurveyAnswers(ids)
                    .subscribe(() => {
                        this.answerGroupDeleted.emit(this.answer.id);
                    }, () => {
                        this.answerGroupDeleted.emit(this.answer.id);
                    });
            }
        }
    }

    public manageQuestionGroupDisplay() {
        if (this.questionGroup.nativeElement.style.display == 'none') {
            this.questionGroup.nativeElement.style.display = 'block';
            this.groupIcon = "md-arrow-dropdown";
        } else {
            this.questionGroup.nativeElement.style.display = 'none';
            this.groupIcon = "md-arrow-dropup";
        }
    }

    private findAnswerById(answerId: string){
        const answerCount = this.answer.childSurveyAnswerList.length;
        for (let index = 0; index < answerCount; index++) {
            if (this.answer.childSurveyAnswerList[index].id == answerId) {
                return index;
            }
        }
        return 0;
    }

    public deleteRemainingAnswers(answerId: string){
        const startIndex = this.findAnswerById(answerId) + 1;
        let ids = [];

        for (let index = startIndex; index < this.answer.childSurveyAnswerList.length; index++) {
            if(this.answer.childSurveyAnswerList[index].id) {
                ids.push(this.answer.childSurveyAnswerList[index].id);
            }
            this.resetAnswerCollection(index);
        }

        this.deleteSavedAnswers(ids);
        this.answeredQuestions.splice(startIndex);
        this.questionIndex = startIndex - 1;
    }

    private deleteSavedAnswers(ids: string[]){
        if(ids.length > 0) {
            this.surveyRepo.deleteSurveyAnswers(ids)
                .subscribe(() => {
                }, error => {
                    console.log("Error on delete remaining survey question", error);
                });
        }
    }

    private resetAnswerCollection(index: number){
        this.answer.childSurveyAnswerList[index].id = null;
        this.answer.childSurveyAnswerList[index].idSurveyQuestionChoice = null;
        this.answer.childSurveyAnswerList[index].answer = "";
    }
}
