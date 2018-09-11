import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InspectionSurveyAnswerRepositoryProvider} from "../../providers/repositories/inspection-survey-answer-repository-provider";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {InspectionSurveySummaryCategory} from "../../models/inspection-survey-summary-category";

@IonicPage()
@Component({
    selector: 'page-inspection-question-summary',
    templateUrl: 'inspection-survey-summary.html',
})
export class InspectionSurveySummaryPage {

    public inspectionQuestionSummaryCategory: InspectionSurveySummaryCategory[] = [];
    public idInspection: string = '';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public controller: InspectionSurveyAnswerRepositoryProvider,
                private messageTools: MessageToolsProvider,) {

        this.idInspection = this.navParams.get('idInspection');
        this.loadInspectionQuestionSummary();
    }

    public loadInspectionQuestionSummary() {
        this.controller.getAnswerSummaryList(this.idInspection)
            .subscribe(result => {
                    this.inspectionQuestionSummaryCategory = result;
                },
                error => {
                    this.messageTools.showToast('Une erreur est survenue lors du chargement du résumé du questionnaire, veuillez réessayer ultérieurement.', 5);
                    this.navCtrl.pop();
                });
    }

    public ionViewWillLeave() {
        this.navCtrl.setRoot('InspectionListPage');
        this.navCtrl.popToRoot();
    }
}
