import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InspectionBuildingHomeComponent } from './inspection-building-home/inspection-building-home.component';
import { InspectionBuildingDetailsComponent } from './inspection-building-details/inspection-building-details.component';
import { InspectionBuildingContactsComponent } from './inspection-building-contacts/inspection-building-contacts.component';
import { InspectionBuildingPnapsComponent } from './inspection-building-pnaps/inspection-building-pnaps.component';
import { InspectionBuildingHazardousMaterialsComponent } from './inspection-building-hazardous-materials/inspection-building-hazardous-materials.component';
import { InspectionBuildingFireProtectionComponent } from './inspection-building-fire-protection/inspection-building-fire-protection.component';
import { InspectionBuildingParticularRisksComponent } from './inspection-building-particular-risks/inspection-building-particular-risks.component';
import { InspectionBuildingAnomaliesComponent } from './inspection-building-anomalies/inspection-building-anomalies.component';

const routes: Routes = [{
  path: '',
  component: InspectionBuildingHomeComponent,
  children: [
    { path: '', redirectTo: 'details' },
    { path: 'details', component: InspectionBuildingDetailsComponent },
    { path: 'contacts', component: InspectionBuildingContactsComponent },
    { path: 'pnaps', component: InspectionBuildingPnapsComponent },
    { path: 'hazardous-materials', component: InspectionBuildingHazardousMaterialsComponent },
    { path: 'fire-protection', component: InspectionBuildingFireProtectionComponent },
    { path: 'particular-risks', component: InspectionBuildingParticularRisksComponent },
    { path: 'anomalies', component: InspectionBuildingAnomaliesComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionBuildingRoutingModule { }
