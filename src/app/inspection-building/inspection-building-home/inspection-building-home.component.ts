import { Component, OnInit } from '@angular/core';
import { InspectionConfigurationProvider } from 'src/app/core/services/controllers/inspection-configuration/inspection-configuration';
import { Router } from '@angular/router';
import { InspectionControllerProvider } from 'src/app/core/services/controllers/inspection-controller/inspection-controller';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'src/app/shared/interfaces/menu-item.interface';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-inspection-building-home',
  templateUrl: './inspection-building-home.component.html',
  styleUrls: ['./inspection-building-home.component.scss'],
})
export class InspectionBuildingHomeComponent implements OnInit {

  public get name(): string {
    return this.controller.currentBuildingName;
  }

  public menuItems: MenuItem[] = [];
  public labels = {};

  constructor(
    private router: Router,
    private menuController: MenuController,
    private controller: InspectionControllerProvider,
    private translateService: TranslateService,
    private configurationService: InspectionConfigurationProvider
  ) {
  }

  async ngOnInit() {
    this.loadTranslation();
  }

  ionViewWillEnter() {
    const menuid = 'inspection-building-menu';
    this.menuController.enable(true, menuid);
  }

  private loadMenuConfiguration() {
    const configuration = this.configurationService.configuration;
    this.menuItems = [
      {
        title: this.labels['buildingDetail'],
        page: 'details',
        icon: 'information-circle',
        enabled: configuration.hasBuildingDetails },
      {
        title: this.labels['contacts'],
        page: 'contacts',
        icon: 'contacts',
        enabled: configuration.hasBuildingContacts },
      {
        title: this.labels['pnaps'],
        page: 'pnaps',
        icon: 'people',
        enabled: configuration.hasBuildingPnaps },
      {
        title: this.labels['hazardousMaterial'],
        page: 'hazardous-materials',
        icon: 'nuclear',
        enabled: configuration.hasBuildingHazardousMaterials },
      {
        title: this.labels['fireSafety'], page: 'fire-protection',
        icon: 'flame',
        enabled: configuration.hasBuildingFireProtection },
      {
        title: this.labels['particularRisk'],
        page: 'particular-risks',
        icon: 'flash',
        enabled: configuration.hasBuildingParticularRisks },
      {
        title: this.labels['anomalies'],
        page: 'anomalies',
        icon: 'warning',
        enabled: configuration.hasBuildingAnomalies },
    ];
  }

  public loadTranslation() {
    this.translateService.get(['buildingDetail', 'contacts', 'hazardousMaterial', 'pnaps', 'fireSafety', 'particularRisk', 'anomalies'])
    .subscribe(
      labels => {
        this.labels = labels;
        this.loadMenuConfiguration();
      },
      error => console.log(error));
  }

  public goBack(): void {
    const route = '/inspection/' + this.controller.idInspection + '/buildings/';
    this.router.navigate([route]);
  }

  public getBackUrl(): string[] {
    return ['/inspection', this.controller.idInspection, 'buildings'];
  }

  public getFullUrl(pageName: string): string {
    return '/inspection/' + this.controller.idInspection + '/buildings/' + this.controller.currentIdBuilding + '/' + pageName;
  }
}
