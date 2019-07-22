import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionBuildingRoutingModule } from './inspection-building-routing.module';
import { InspectionBuildingAnomaliesComponent } from './inspection-building-anomalies/inspection-building-anomalies.component';
import { InspectionBuildingDetailsComponent } from './inspection-building-details/inspection-building-details.component';
import { InspectionBuildingContactsComponent } from './inspection-building-contacts/inspection-building-contacts.component';
import { InspectionBuildingPnapsComponent } from './inspection-building-pnaps/inspection-building-pnaps.component';
import { InspectionBuildingHazardousMaterialsComponent } from './inspection-building-hazardous-materials/inspection-building-hazardous-materials.component';
import { InspectionBuildingFireProtectionComponent } from './inspection-building-fire-protection/inspection-building-fire-protection.component';
import { InspectionBuildingParticularRisksComponent } from './inspection-building-particular-risks/inspection-building-particular-risks.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { InspectionBuildingHomeComponent } from './inspection-building-home/inspection-building-home.component';
import { BuildingHazardousMaterialDetailComponent } from './components/building-hazardous-material-detail/building-hazardous-material-detail.component';
import { BuildingPnapDetailComponent } from './components/building-pnap-detail/building-pnap-detail.component';
import { BuildingWaterSprinklerComponent } from './components/building-water-sprinkler/building-water-sprinkler.component';
import { HazardousMaterialSelectionComponent } from './components/hazardous-material-selection/hazardous-material-selection.component';
import { BuildingAlarmPanelComponent } from './components/building-alarm-panel/building-alarm-panel.component';
import { BuildingAnomalyDetailComponent } from './components/building-anomaly-detail/building-anomaly-detail.component';
import { AnomalyThemeSelectionComponent } from './components/anomaly-theme-selection/anomaly-theme-selection.component';
import { BuildingContactDetailComponent } from './components/building-contact-detail/building-contact-detail.component';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  declarations: [
    InspectionBuildingDetailsComponent,
    InspectionBuildingContactsComponent,
    InspectionBuildingPnapsComponent,
    InspectionBuildingHazardousMaterialsComponent,
    InspectionBuildingFireProtectionComponent,
    InspectionBuildingParticularRisksComponent,
    InspectionBuildingAnomaliesComponent,
    InspectionBuildingHomeComponent,
    BuildingContactDetailComponent,
    BuildingHazardousMaterialDetailComponent,
    BuildingPnapDetailComponent,
    BuildingWaterSprinklerComponent,
    HazardousMaterialSelectionComponent,
    BuildingAlarmPanelComponent,
    BuildingAnomalyDetailComponent,
    AnomalyThemeSelectionComponent
  ],
  entryComponents: [
    BuildingContactDetailComponent,
    BuildingHazardousMaterialDetailComponent,
    BuildingPnapDetailComponent,
    BuildingWaterSprinklerComponent,
    HazardousMaterialSelectionComponent,
    BuildingAlarmPanelComponent,
    BuildingAnomalyDetailComponent,
    AnomalyThemeSelectionComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    InspectionBuildingRoutingModule,
    BrMaskerModule,
  ]
})
export class InspectionBuildingModule { }
