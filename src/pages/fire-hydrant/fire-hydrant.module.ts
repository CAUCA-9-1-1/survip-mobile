import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FireHydrantPage } from './fire-hydrant';

@NgModule({
  declarations: [
    FireHydrantPage,
  ],
  imports: [
    IonicPageModule.forChild(FireHydrantPage),
  ],
})
export class FireHydrantPageModule {}
