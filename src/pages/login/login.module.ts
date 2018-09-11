import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {LoginPage} from './login';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    declarations: [
        LoginPage,
    ],
    imports: [
        IonicPageModule.forChild(LoginPage),
        TranslateModule.forChild(),
    ],
    providers: [
        KeychainTouchId,
    ]
})
export class LoginPageModule {
}
