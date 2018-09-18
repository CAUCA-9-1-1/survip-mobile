import {Component, EventEmitter, Input, NgZone, Output} from '@angular/core';
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
    @Input() showTitle = true;
    @Output() questionAnswered = new EventEmitter<any>();
    @Output() remainingQuestionResetNeeded = new EventEmitter<any>();
    @Input() idParent = null;

    public questionTypeEnum = SurveyQuestionTypeEnum;
    private changingValueTimer = null;
    public answer = "";
    private labels = {};
    private dataSource;

    @Input()
    set question(value: InspectionSurveyAnswer) {
        this.dataSource = value;
        if (this.dataSource.answer) {
            this.answer = this.dataSource.answer;
        } else {
            this.answer = "";
        }
    }

    get question() {
        return this.dataSource;
    }

    constructor(private questionRepo: InspectionSurveyAnswerRepositoryProvider,
                private msgTools: MessageToolsProvider,
                private translateService: TranslateService) {

    }

    ngOnInit() {
        this.translateService.get([
            'surveyChangingAnswerQuestion', 'confirmation'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public async validateAnswer() {
        if (await this.validateNextQuestionSequence()) {
            if (this.answer) {
                this.dataSource.answer = this.answer;
                if (this.dataSource.questionType == this.questionTypeEnum.choiceAnswer) {
                    this.dataSource.idSurveyQuestionChoice = this.answer;
                }
                this.saveAnswer();
            }
        }
    }

    public textAnswerChanged() {
        if (this.changingValueTimer) {
            clearTimeout(this.changingValueTimer);
        }
        this.changingValueTimer = setTimeout(() => {
            this.saveAnswer();
        }, 500);
    }

    private saveAnswer() {
        if (this.idParent) {
            this.dataSource.idParent = this.idParent;
        }
        this.questionRepo.answerQuestion(this.dataSource)
            .subscribe(result => {
                    this.dataSource.id = result['id'];
                    this.questionAnswered.emit(this.question);
                },
                error => {
                    console.log("Erreur lors de la sauvegarde de la réponse.");
                });
    }

    private async validateNextQuestionSequence() {
        if (this.nextQuestionChanged()) {
            let canDelete = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyChangingAnswerQuestion']);
            if (canDelete) {
                this.remainingQuestionResetNeeded.emit(this.dataSource.id);
                return true;
            } else {
                this.answer = this.dataSource.answer;
            }
            return false;
        }
        return true;
    }

    private nextQuestionChanged() {
        let retValue = false;
        if (this.dataSource.answer) {
            if (this.dataSource.questionType == SurveyQuestionTypeEnum.choiceAnswer) {
                retValue = this.nextQuestionFromChoiceChanged();
            }
        }
        return retValue;
    }

    private nextQuestionFromChoiceChanged() {
        const NewChoice = this.dataSource.choicesList.filter((choice) => choice.id == this.dataSource.idSurveyQuestionChoice);
        const originalChoice = this.dataSource.choicesList.filter((choice) => choice.id == this.answer);

        if (NewChoice[0].idSurveyQuestionNext != originalChoice[0].idSurveyQuestionNext) {
            return true;
        }
        return false
    }
}
