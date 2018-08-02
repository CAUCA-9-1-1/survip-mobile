import {Component, OnDestroy} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {MenuItem} from '../../interfaces/menu-item.interface';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {ISubscription} from 'rxjs/Subscription';
import {TranslateService} from "@ngx-translate/core";

@IonicPage({
    segment: 'inspection/:id'
})
@Component({
    selector: 'page-intervention-home',
    templateUrl: 'intervention-home.html',
})
export class InterventionHomePage implements OnDestroy {
    private rootPage = 'InterventionGeneralPage';
    private readonly planSubscription: ISubscription;

    menuItems: MenuItem[];
    mustShowPlanMenu: boolean = false;
    labels = {};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public menuCtrl: MenuController,
                private controller: InspectionControllerProvider,
                private translateService: TranslateService) {
        controller.setIdInterventionForm(this.navParams.data['id']);

        this.planSubscription = controller.planLoaded.subscribe(() => {
                if (controller.inspectionDetail.idSurvey)
                    this.mustShowPlanMenu = true;
                else
                    this.mustShowPlanMenu = false;
            }
        );
    }

    ngOnInit() {
        this.translateService.get([
            'generalInformation', 'Buildings', 'waterSupplies', 'implantationPlan', 'course'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });

        this.menuItems = [
            {title: this.labels['generalInformation'], page: 'InterventionGeneralPage', icon: 'information-circle'},
            {title: this.labels['Buildings'], page: 'InterventionBuildingsPage', icon: 'home'},
            {title: this.labels['waterSupplies'], page: 'InterventionWaterSuppliesPage', icon: 'water'},
            {title: this.labels['implantationPlan'], page: 'InterventionImplantationPlanPage', icon: 'image'},
            {title: this.labels['course'], page: 'InterventionCoursePage', icon: 'map'}
        ];
    }

    ngOnDestroy() {
        if (this.planSubscription)
            this.planSubscription.unsubscribe();
    }

    ionViewDidLoad() {
    }

    ionViewDidEnter() {
        this.menuCtrl.enable(true, 'inspectionMenu');
        this.menuCtrl.enable(false, 'buildingMenu');
        this.menuCtrl.enable(false, 'inspectionListMenu');
    }

    openPage(page) {
        this.rootPage = page;
    }

    goToInspectionQuestions() {
        if (this.controller.inspectionDetail.isSurveyCompleted) {
            this.navCtrl.push('InspectionQuestionSummaryPage', {idInspection: this.controller.idInspection});
        }
        else {
            this.navCtrl.push('InspectionQuestionPage', {
                idInspection: this.controller.idInspection,
                inspectionSurveyCompleted: this.controller.inspectionDetail.isSurveyCompleted
            });
        }
    }

    goBackToInspectionList() {
        this.navCtrl.setRoot('InspectionListPage');
    }
}
