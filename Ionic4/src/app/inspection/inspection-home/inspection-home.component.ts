import { Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { InspectionConfigurationProvider } from 'src/app/core/services/controllers/inspection-configuration/inspection-configuration';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { MenuItem } from 'src/app/shared/interfaces/menu-item.interface';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inspection-home',
  templateUrl: './inspection-home.component.html',
  styleUrls: ['./inspection-home.component.scss'],
})
export class InspectionHomeComponent implements OnInit, OnDestroy {  

  private readonly planSubscription: Subscription;
  private readonly menuSubscription: Subscription;

  public menuItems: MenuItem[];
  public mustShowPlanMenu: boolean = false;
  public labels = {};

  constructor(
    private router: Router,
    private menuController: MenuController,
    private controller: InspectionControllerProvider,
    private translateService: TranslateService,
    private configurationService: InspectionConfigurationProvider
  ) { }

  async ngOnInit() {
    this.translateService.get(['generalInformation', 'buildings', 'waterSupplies', 'implantationPlan', 'course', 'survey'])
      .subscribe(labels => {
        this.labels = labels;
        this.loadMenu();
      },
      error => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    if (this.planSubscription) {
      this.planSubscription.unsubscribe();
    }
    if (this.menuSubscription) {
      this.menuSubscription.unsubscribe();
    }
  }

  private loadMenu() {
    const configuration = this.configurationService.configuration;
    this.menuItems = [
      {
        title: this.labels['generalInformation'],
        page: 'general',
        icon: 'information-circle',
        enabled: true },
      {
        title: this.labels['buildings'],
        page: 'buildings',
        icon: 'home',
        enabled: this.mustShowBuildingSection()},
      {
        title: this.labels['waterSupplies'],
        page: 'fire-hydrants',
        icon: 'water',
        enabled: configuration.hasWaterSupply},
      {
        title: this.labels['implantationPlan'],
        page: 'implantation-plan',
        icon: 'image',
        enabled: configuration.hasImplantationPlan},
      {
        title: this.labels['course'],
        page: 'courses',
        icon: 'map',
        enabled: configuration.hasCourse},
      {
        title: this.labels['survey'],
        page: this.controller.inspection.isSurveyCompleted ? 'survey-summary' : 'survey',
        icon: 'list-box',
        enabled: this.controller.inspection.idSurvey != null && this.controller.inspection.idSurvey !== ''
      }
    ];
  }

  public getFullUrl(pageName: string): string {
    return 'inspection/' + this.controller.idInspection + '/' + pageName;
  }

  public async openPage(pageName: string) {
    const route = this.getFullUrl(pageName);
    await this.router.navigate([route]);
    this.menuController.close();
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
}
