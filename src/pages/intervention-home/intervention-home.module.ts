import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionHomePage } from './intervention-home';
import {ComponentsModule} from '../../components/components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InterventionHomePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(InterventionHomePage),
    TranslateModule.forChild(),
  ],
  exports: [
    InterventionHomePage
  ]
})
export class InterventionHomePageModule {}
