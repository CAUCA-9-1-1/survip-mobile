import {Component, OnDestroy} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {MenuItem} from '../../interfaces/menu-item.interface';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {ISubscription} from 'rxjs/Subscription';
import {TranslateService} from "@ngx-translate/core";
import {InspectionConfigurationProvider} from '../../providers/inspection-configuration/inspection-configuration';

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
    private menuSubscription: ISubscription;

    public menuItems: MenuItem[];
    public mustShowPlanMenu: boolean = false;
    public labels = {};

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public menuCtrl: MenuController,
                private controller: InspectionControllerProvider,
                private translateService: TranslateService,
                private configurationService: InspectionConfigurationProvider) {
      controller.setIdInterventionForm(this.navParams.data['id']);
      this.planSubscription = controller.planLoaded.subscribe((value) => {
          if (value == 'loadingError') {
            this.goBackToInspectionList();
          }
          else if (controller.inspectionDetail.idSurvey) {
            this.mustShowPlanMenu = true;
          } else {
            this.mustShowPlanMenu = false;
          }
        }
      );
    }

    public ngOnInit() {
        this.translateService.get([
            'generalInformation', 'buildings', 'waterSupplies', 'implantationPlan', 'course', 'survey'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });

      if (!this.configurationService.configuration) {
        this.configurationService.loadConfiguration(this.controller.idInspection)
          .then(() =>
              this.menuSubscription = this.configurationService.menuRefreshed
                .subscribe(() => this.loadMenu())
          )
      } else {
        this.menuSubscription = this.configurationService.menuRefreshed.subscribe(() => this.loadMenu());
      }
    }

    private loadMenu(){
        const configuration = this.configurationService.configuration;
        this.menuItems = [
            {title: this.labels['generalInformation'], page: 'InterventionGeneralPage', icon: 'information-circle', enabled: true, customAction: this.openPage},
            {title: this.labels['buildings'], page: 'InterventionBuildingsPage', icon: 'home', enabled: this.mustShowBuildingSection(), customAction: this.openPage},
            {title: this.labels['waterSupplies'], page: 'InterventionWaterSuppliesPage', icon: 'water', enabled: configuration.hasWaterSupply, customAction: this.openPage},
            {title: this.labels['implantationPlan'], page: 'InterventionImplantationPlanPage', icon: 'image', enabled: configuration.hasImplantationPlan, customAction: this.openPage},
            {title: this.labels['course'], page: 'InterventionCoursePage', icon: 'map', enabled: configuration.hasCourse, customAction: this.openPage},
            {title: this.labels['survey'], page: '', icon: 'list-box', enabled: configuration.hasSurvey, customAction: this.goToInspectionQuestions}
        ];
    }

    private mustShowBuildingSection(): boolean {
      const configuration = this.configurationService.configuration;
      return (configuration.hasBuildingAnomalies
        || configuration.hasBuildingContacts
        || configuration.hasBuildingFireProtection
        || configuration.hasBuildingDetails
        || configuration.hasBuildingHazardousMaterials
        || configuration.hasBuildingParticularRisks
        || configuration.hasBuildingPnaps);
    }

    public ngOnDestroy() {
        if (this.planSubscription) {
            this.planSubscription.unsubscribe();
        }
        if(this.menuSubscription){
            this.menuSubscription.unsubscribe();
        }
    }

    public ionViewDidEnter() {
        this.menuCtrl.enable(true, 'inspectionMenu');
        this.menuCtrl.enable(false, 'buildingMenu');
        this.menuCtrl.enable(false, 'inspectionListMenu');
    }

    public openPage = (page) => {
      console.log('icitte', page);
        this.rootPage = page;
    }

    public goToInspectionQuestions = () => {
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

    public goBackToInspectionList() {
        this.navCtrl.setRoot('InspectionListPage');
    }
}
