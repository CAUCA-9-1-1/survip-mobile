import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingContactDetailPage } from './building-contact-detail';

@NgModule({
  declarations: [
    BuildingContactDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingContactDetailPage),
  ],
})
export class BuildingContactDetailPageModule {}
