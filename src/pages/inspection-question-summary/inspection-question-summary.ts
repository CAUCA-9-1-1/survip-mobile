import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {InspectionQuestionRepositoryProvider} from "../../providers/repositories/inspection-question-repository-provider";
import {InspectionQuestionSummary} from "../../models/inspection-question-summary";
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {InspectionQuestionSummaryCategory} from "../../models/inspection-question-summary-category";
import {InterventionGeneralPage} from "../intervention-general/intervention-general";

@IonicPage()
@Component({
    selector: 'page-inspection-question-summary',
    templateUrl: 'inspection-question-summary.html',
})
export class InspectionQuestionSummaryPage {

    public inspectionQuestionSummaryCategory: InspectionQuestionSummaryCategory[] = [];
    public inspectionQuestionSummary: InspectionQuestionSummary[] = [];
    public idInspection: string = '';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public controller: InspectionQuestionRepositoryProvider,
                private authService: AuthenticationService,
                private messageTools: MessageToolsProvider,) {

        this.idInspection = this.navParams.get('idInspection');
        this.loadInspectionQuestionSummary();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InspectionQuestionSummaryPage');
    }

    async ionViewCanEnter() {
        let isLoggedIn = await this.authService.isStillLoggedIn();
        if (!isLoggedIn)
            this.navCtrl.setRoot('LoginPage');
    }

    loadInspectionQuestionSummary() {
        this.controller.getAnswerSummaryList(this.idInspection)
            .subscribe(result => {
                    this.inspectionQuestionSummaryCategory = result;
                },
                error => {
                    this.messageTools.showToast('Une erreur est survenue lors du chargement du résumé du questionnaire, veuillez réessayer ultérieurement.', 5);
                    this.navCtrl.pop();
                });
    }

    ionViewWillLeave(){
        this.navCtrl.setRoot('InspectionListPage');
        this.navCtrl.popToRoot();
    }
}
