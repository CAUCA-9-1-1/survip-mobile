import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InspectionSurveyAnswerRepositoryProvider} from "../../providers/repositories/inspection-survey-answer-repository-provider";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {InspectionSurveySummaryCategory} from "../../models/inspection-survey-summary-category";
import {SurveyQuestionTypeEnum} from "../../models/inspection-survey-answer";
import {InspectionSurveyAnswerPage} from '../inspection-survey-answer/inspection-survey-answer';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-inspection-survey-summary',
    templateUrl: 'inspection-survey-summary.html',
})
export class InspectionSurveySummaryPage {

    public inspectionQuestionSummaryCategory: InspectionSurveySummaryCategory[] = [];
    public idInspection: string = '';
    public questionTypeEnum = SurveyQuestionTypeEnum;
    private labels = {}

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public controller: InspectionSurveyAnswerRepositoryProvider,
                private msgTools: MessageToolsProvider,
                private translateService: TranslateService) {

        this.idInspection = this.navParams.get('idInspection');
        this.loadInspectionQuestionSummary();
    }

    public ngOnInit(){
        this.translateService.get([
            'confirmation', 'surveyEditionQuestion','surveyEditionRedirectionMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public loadInspectionQuestionSummary() {
        this.controller.getAnswerSummaryList(this.idInspection)
            .subscribe(result => {
                    this.inspectionQuestionSummaryCategory = result;
                },
                error => {
                    this.msgTools.showToast('Une erreur est survenue lors du chargement du résumé du questionnaire, veuillez réessayer ultérieurement.', 5);
                    this.navCtrl.pop();
                });
    }

    public async ionViewWillLeave() {
      if (this.navCtrl.getPrevious().name == 'InspectionSurveyAnswerPage') {
        await this.navCtrl.pop();
      }
    }

    public async editSurvey(){
        let canEdit = await this.msgTools.ShowMessageBox(this.labels['confirmation'], this.labels['surveyEditionQuestion']);
        if(canEdit) {
            this.controller.SetSurveyStatus(this.idInspection, false)
                .subscribe(result => {
                        this.msgTools.showToast(this.labels['surveyEditionRedirectionMessage'], 3);
                        setTimeout(() => {
                            this.navCtrl.pop();
                            this.navCtrl.push('InspectionSurveyAnswerPage', {
                                idInspection: this.idInspection,
                                inspectionSurveyCompleted: false
                            });
                        }, 3000);
                    },
                    error => {
                        console.log('Reedit survey error :', error);
                    });
        }
    }
}
