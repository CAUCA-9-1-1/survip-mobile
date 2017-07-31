import { IonicPageModule } from 'ionic-angular';
import { InterventionGeneralPage } from './intervention-general';
import {SearchBoxComponentModule} from '../../components/search-box/search-box.module';
import {InterventionDetailRepositoryProvider} from '../../providers/repositories/intervention-detail-repository';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [
    InterventionGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionGeneralPage),
    SearchBoxComponentModule,
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
