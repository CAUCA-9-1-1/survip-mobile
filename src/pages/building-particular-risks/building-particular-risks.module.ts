import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildingParticularRisksPage } from './building-particular-risks';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    BuildingParticularRisksPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildingParticularRisksPage),
    ComponentsModule
  ],
})
export class BuildingParticularRisksPageModule {}
