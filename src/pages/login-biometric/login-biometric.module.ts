import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginBiometricPage } from './login-biometric';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        LoginBiometricPage,
    ],
    imports: [
        IonicPageModule.forChild(LoginBiometricPage),
        TranslateModule.forChild(),
    ],
})
export class LoginBiometricPageModule {}
