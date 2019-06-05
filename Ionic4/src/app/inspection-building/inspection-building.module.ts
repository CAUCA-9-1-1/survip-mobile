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

@NgModule({
  declarations: [
    InspectionBuildingDetailsComponent,
    InspectionBuildingContactsComponent,
    InspectionBuildingPnapsComponent,
    InspectionBuildingHazardousMaterialsComponent,
    InspectionBuildingFireProtectionComponent,
    InspectionBuildingParticularRisksComponent,
    InspectionBuildingAnomaliesComponent,
    InspectionBuildingHomeComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    InspectionBuildingRoutingModule
  ]
})
export class InspectionBuildingModule { }
