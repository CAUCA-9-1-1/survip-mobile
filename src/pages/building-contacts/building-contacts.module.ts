import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingContactsPage } from './building-contacts';

@NgModule({
  declarations: [
    BuildingContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingContactsPage),
  ],
})
export class BuildingContactsPageModule {}
