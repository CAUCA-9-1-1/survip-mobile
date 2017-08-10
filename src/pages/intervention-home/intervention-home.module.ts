import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionHomePage } from './intervention-home';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    InterventionHomePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(InterventionHomePage),
  ],
  exports: [
    InterventionHomePage
  ]
})
export class InterventionHomePageModule {}
