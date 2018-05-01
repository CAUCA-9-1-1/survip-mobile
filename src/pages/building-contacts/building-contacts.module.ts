import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingContactsPage } from './building-contacts';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    BuildingContactsPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingContactsPage),
    PipesModule
  ],
})
export class BuildingContactsPageModule {}
