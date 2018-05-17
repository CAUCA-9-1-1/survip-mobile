import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnomalyThemeSelectionPage } from './anomaly-theme-selection';
import {PipesModule} from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    AnomalyThemeSelectionPage,
  ],
  imports: [
    IonicPageModule.forChild(AnomalyThemeSelectionPage),
    PipesModule
  ],
})
export class AnomalyThemeSelectionPageModule {}
