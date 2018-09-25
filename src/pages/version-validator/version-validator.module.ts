import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VersionValidatorPage } from './version-validator';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    VersionValidatorPage,
  ],
  imports: [
    IonicPageModule.forChild(VersionValidatorPage),
      TranslateModule.forChild(),
  ],
})
export class VersionValidatorPageModule {}
