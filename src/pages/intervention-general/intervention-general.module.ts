import { IonicPageModule } from 'ionic-angular';
import { InterventionGeneralPage } from './intervention-general';
import {NgModule} from '@angular/core';
import {ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    InterventionGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionGeneralPage),
    ComponentsModule
    //SearchListComponentModule
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
