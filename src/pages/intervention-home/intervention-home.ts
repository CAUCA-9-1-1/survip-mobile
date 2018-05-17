import {Component} from '@angular/core';
import {AlertController, IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {InterventionGeneralPage} from '../intervention-general/intervention-general';
import {InterventionWaterSuppliesPage} from '../intervention-water-supplies/intervention-water-supplies';
import {InterventionBuildingsPage} from '../intervention-buildings/intervention-buildings';
import {InterventionCoursePage} from '../intervention-course/intervention-course';
import {InterventionFireProtectionPage} from '../repositories-fire-protection/repositories-fire-protection';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';

@IonicPage({
    segment: 'inspection/:id'
})
@Component({
    selector: 'page-intervention-home',
    templateUrl: 'intervention-home.html',
})
export class InterventionHomePage {
    private rootPage = 'InterventionGeneralPage';
    private generalPage = 'InterventionGeneralPage';
    private waterSuppliesPage = 'InterventionWaterSuppliesPage';
    private buildingsPage = 'InterventionBuildingsPage';
    private fireProtectionPage = 'InterventionFireProtectionPage';
    private coursePage = 'InterventionCoursePage';
    private implantationPlanPage = 'InterventionImplantationPlanPage';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public menuCtrl: MenuController,
                private controller: InspectionControllerProvider,
                private alertCtrl: AlertController,) {
        controller.setIdInterventionForm(this.navParams.data['id']);
    }

    ionViewDidLoad() {
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(true, 'inspectionMenu');
        this.menuCtrl.enable(false, 'buildingMenu');
    }

    closeMenu() {
        this.menuCtrl.close();
    }

    openPage(page) {
        this.rootPage = page;
    }

    goToInspectionQuestions() {
        if (this.controller.inspectionDetail.isSurveyCompleted) {
            this.SurveyNavigationPopup().present();
        } else {
            this.navCtrl.push('InspectionQuestionPage', {
                idInspection: this.controller.idInspection,
                inspectionSurveyCompleted: this.controller.inspectionDetail.isSurveyCompleted
            });
        }
    }

    SurveyNavigationPopup() {
        let alert = this.alertCtrl.create();
        alert.setTitle('Questionnaire d\'inspection');
        alert.setMessage('Le questionnaire est déjà complété, que voulez-vous faire : ');
        alert.addButton({
            text: 'Recommencer le questionnaire', handler: () => {
                alert.dismiss(true);
                this.navCtrl.push('InspectionQuestionPage', {
                    idInspection: this.controller.idInspection,
                    inspectionSurveyCompleted: this.controller.inspectionDetail.isSurveyCompleted
                });
                return false;
            }
        });
        alert.addButton({
            text: 'Voir le résumé du questionnaire', handler: () => {
                alert.dismiss(true);
                this.navCtrl.push('InspectionQuestionSummaryPage', {idInspection: this.controller.idInspection});
                return false;
            }
        });
        alert.addButton({
            text: 'Retourner au détail de l\'inspection', handler: () => {
                alert.dismiss(true);
                return false;
            }
        });
        return alert;
    }

    async goBackToInspectionList(){
        await this.navCtrl.popToRoot();
        await this.navCtrl.setRoot('InspectionListPage');
    }
}
