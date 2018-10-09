import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {AuthenticationService} from '../../providers/Base/authentification.service';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    public userName: string;
    public password: string;
    public labels = {};

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
        if (localStorage.getItem('currentToken')) {
            let isLoggedIn = await this.authService.isStillLoggedIn();
            if (isLoggedIn) {
                return this.redirectToInspectionList();
            }
        }

        this.translateService.get([
            'loginError', 'biometric.confirmYourFingerprint'
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

    public onLogin() {
        this.authService.login(this.userName, this.password, true)
            .subscribe(
                response => this.handleResponse(response));
    }

    public onKeyPress(keyCode) {
        if (keyCode == 13)
            this.onLogin();
    }

    private validateKeychainTouchId() {
        if ("cordova" in window) {
            this.keychainTouchId.isAvailable().then(biometricType => {
                this.keychainTouchId.has(this.authService.keychainTouchIdKey).then(result => {
                    console.log('keychain-touch-id, has key', result);
                    this.keychainTouchId.verify(this.authService.keychainTouchIdKey, this.labels['biometric.confirmYourFingerprint'])
                        .then(saveInfo => {
                            const user = JSON.parse(saveInfo);

                            this.authService.login(user.username, user.password, false)
                                .subscribe(response => this.handleResponse(response));
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

    private handleResponse(response) {
        if (localStorage.getItem('currentToken')) {
            this.redirectToInspectionList();
        }  else if(response.status == 401) {
            this.showToast("Nom d'usager ou mot de passe incorrect.");
        }else if (response.status !== 200) {
            this.showToast("Problème de communication avec le serveur.  Veuillez communiquer avec un adminstrateur.");
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
