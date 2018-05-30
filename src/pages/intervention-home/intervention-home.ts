import {Component, OnDestroy} from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';
import {MenuItem} from '../../interfaces/menu-item.interface';
import {InspectionControllerProvider} from '../../providers/inspection-controller/inspection-controller';
import {ISubscription} from 'rxjs/Subscription';

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

  public menuItems: MenuItem[];
  public mustShowPlanMenu: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private controller: InspectionControllerProvider) {
    controller.setIdInterventionForm(this.navParams.data['id']);
    this.menuItems = [
      { title: 'Infos générales', page:'InterventionGeneralPage', icon:'information-circle' },
      { title: 'Bâtiments', page:'InterventionBuildingsPage', icon:'home' },
      { title: 'Alimentation en eau', page:'InterventionWaterSuppliesPage', icon:'water' },
      { title: "Plan d'implantation", page:'InterventionImplantationPlanPage', icon:'image' },
      { title: 'Parcours', page:'InterventionCoursePage', icon:'map' }
    ];

    this.planSubscription = controller.planLoaded.subscribe(() => {
        if (controller.inspectionDetail.idSurvey)
          this.mustShowPlanMenu = true;
        else
          this.mustShowPlanMenu = false;
      }
    );
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

  public async goBackToInspectionList(){
    await this.navCtrl.popToRoot();
    await this.navCtrl.setRoot('InspectionListPage');
  }
}
