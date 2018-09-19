import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {AuthenticationService} from '../../providers/Base/authentification.service';

/**
 * Generated class for the LoginBiometricPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login-biometric',
    templateUrl: 'login-biometric.html',
})
export class LoginBiometricPage {
    private storingKey = 'biometricActivated';

    public constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private authService: AuthenticationService,
        private keychainTouchId: KeychainTouchId,
        private plt: Platform,
    ) { }

    public ngOnInit() {
        this.keychainTouchId.isAvailable().then(biometricType => {
            console.log('keychain-touch-id, type', biometricType);
        }).catch(error => {
            console.log('keychain-touch-id', error);

            if (error === 'plugin_not_installed') {
                setTimeout(() => {
                    this.ngOnInit();
                }, 100);
            } else {
                this.dontUseBiometric();
            }
        });
    }

    public useBiometric() {
        localStorage.setItem(this.storingKey, 'yes');

        this.navCtrl.push('LoginPage');
    }

    public dontUseBiometric() {
        localStorage.setItem(this.storingKey, 'no');

        this.navCtrl.push('LoginPage');
    }
}
