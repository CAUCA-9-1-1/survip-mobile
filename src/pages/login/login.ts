import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {AuthenticationService, LoginResult} from '../../providers/Base/authentification.service';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    public userName: string;
    public password: string;
    public labels = {};
    public version = "";

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private authService: AuthenticationService,
        private toastCtrl: ToastController,
        private translateService: TranslateService,
        private keychainTouchId: KeychainTouchId,
    ) {
    }

    public async ngOnInit() {

      this.version = await this.authService.getVersion();

      if (await this.authService.isStillLoggedIn()) {
        return this.redirectToInspectionList();
      }

      this.translateService.get([
        'loginError', 'biometric.confirmYourFingerprint','loginCommunicationError'
      ]).subscribe(labels => {
        this.labels = labels;

        const biometricEnabled = localStorage.getItem('biometricActivated') == 'save' ? true : false;
        if (biometricEnabled) {
          this.validateKeychainTouchId();
        }
      }, error => {
        console.log(error)
      });
    }

    public async onLogin() {
        const result = await this.authService.login(this.userName, this.password, true);
        this.handleLoginResult(result);
    }

    public async onKeyPress(keyCode) {
        if (keyCode == 13)
            await this.onLogin();
    }

    private validateKeychainTouchId() {
        if ("cordova" in window) {
            this.keychainTouchId.isAvailable().then(biometricType => {
                this.keychainTouchId.has(this.authService.keychainTouchIdKey).then(result => {
                    console.log('keychain-touch-id, has key', result);
                    this.keychainTouchId.verify(this.authService.keychainTouchIdKey, this.labels['biometric.confirmYourFingerprint'])
                        .then(async (saveInfo) => {
                            const user = JSON.parse(saveInfo);
                            const result = await this.authService.login(user.username, user.password, false);
                            this.handleLoginResult(result, true);
                        })
                        .catch(error => {
                            console.log('keychain-touch-id, can\'t verify the key', error);
                        });
                }).catch(error => {
                    console.log('keychain-touch-id, key doesn\'t exist', error);
                });
            }).catch(error => {
                console.log('keychain-touch-id, is not available', error);
            });
        }
    }

    private handleLoginResult(result: LoginResult, inBiometricLogin: boolean = false) {
        if (result === LoginResult.Ok) {
            this.redirectToInspectionList();
        } else if (result == LoginResult.WrongPasswordOrUserName) {
            if (inBiometricLogin) {
                this.authService.clearKeychainTouchId();
            }
            this.showToast(this.labels['loginError']);
        } else {
            this.showToast(this.labels['loginCommunicationError']);
        }
    }

    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });

        toast.present();
    }

    private redirectToInspectionList() {
        this.navCtrl.push('HomePage');
    }
}
