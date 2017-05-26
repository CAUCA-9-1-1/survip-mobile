import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InterventionGeneralPage } from './intervention-general';
import {SearchListComponent} from '../../components/search-list/search-list';
import {SearchBoxComponentModule} from '../../components/search-box/search-box.module';
import {SearchListComponentModule} from '../../components/search-list/search-list.module';

@NgModule({
  declarations: [
    InterventionGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(InterventionGeneralPage),
    SearchBoxComponentModule,
    SearchListComponentModule
  ],
  entryComponents: [
    SearchListComponent
  ],
  exports: [
    InterventionGeneralPage
  ]
})
export class InterventionGeneralPageModule {}
