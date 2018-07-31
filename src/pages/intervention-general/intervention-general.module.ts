import { IonicPageModule } from 'ionic-angular';
import { InterventionGeneralPage } from './intervention-general';
import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../components/components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InterventionGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionGeneralPage),
    ComponentsModule,
    TranslateModule.forChild(),
  ],
  providers: [

  ],
  entryComponents: [
    //SearchListComponent
  ],
  exports: [
    InterventionGeneralPage
  ]
})
export class InterventionGeneralPageModule {}
