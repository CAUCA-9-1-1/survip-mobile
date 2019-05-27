import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InspectionRoutingModule } from './inspection-routing.module';
import { InspectionHomeComponent } from './inspection-home/inspection-home.component';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { IonicModule } from '@ionic/angular';
import { InspectionGeneralComponent } from './inspection-general/inspection-general.component';

@NgModule({
  declarations: [
    InspectionHomeComponent,
    InspectionGeneralComponent,
  ],
  imports: [
    CoreModule,
    SharedModule,
    CommonModule,
    IonicModule,
    InspectionRoutingModule
  ]
})
export class InspectionModule { }
