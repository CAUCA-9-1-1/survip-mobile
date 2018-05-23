import {Component} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import {InspectionQuestionRepositoryProvider} from "../../providers/repositories/inspection-question-repository-provider";
import {InspectionQuestionSummary} from "../../models/inspection-question-summary";
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {MessageToolsProvider} from "../../providers/message-tools/message-tools";
import {InspectionQuestionSummaryCategory} from "../../models/inspection-question-summary-category";
import {InspectionControllerProvider} from "../../providers/inspection-controller/inspection-controller";

@IonicPage()
@Component({
    selector: 'page-inspection-question-summary',
    templateUrl: 'inspection-question-summary.html',
})
export class InspectionQuestionSummaryPage {

    public inspectionQuestionSummaryCategory: InspectionQuestionSummaryCategory[] = [];
    public inspectionQuestionSummary: InspectionQuestionSummary[] = [];
    public idInspection: string = '';
    private app: App;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public controller: InspectionQuestionRepositoryProvider,
                public inspectionController: InspectionControllerProvider,
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
        this.controller.getAnswerSummaryList(this.inspectionController.idInspection)
            .subscribe(result => {
                    this.inspectionQuestionSummaryCategory = result;
                },
                error => {
                    this.messageTools.showToast('Une erreur est survenue lors du chargement du résumé du questionnaire, veuillez réessayer ultérieurement.', 5);
                    this.app.getRootNav().push('InterventionHomePage', {id: this.inspectionController.idInspection, page: 'InterventionBuildingsPage'});
                });
    }
}
