import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingContactDetailPage } from './building-contact-detail';
import {DirectivesModule} from '../../directives/directives.module';

@NgModule({
  declarations: [
    BuildingContactDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingContactDetailPage),
    DirectivesModule
  ],
})
export class BuildingContactDetailPageModule {}
