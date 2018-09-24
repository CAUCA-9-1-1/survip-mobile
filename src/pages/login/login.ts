import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {Market} from "@ionic-native/market";

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    public userName: string;
    public password: string;
    public labels = {};
    public minimalVersionValid = true;
    public allowLogin = false;
    public storeLink = 'Google Play';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private authService: AuthenticationService,
        private toastCtrl: ToastController,
        private translateService: TranslateService,
        private keychainTouchId: KeychainTouchId,
        private platform: Platform,
        private market: Market,
    ) {
        if(platform.is('ios')){
            this.storeLink = 'App Store';
        }
    }

    public async ngOnInit() {
        this.ValidVersion();

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

    public async ionViewWillEnter() {
        await this.ValidVersion();
    }

    public async ValidVersion() {
        this.minimalVersionValid = await this.authService.MinimalVersionIsValid();
        this.allowLogin = this.minimalVersionValid;
    }

    public onLogin() {
        this.authService.login(this.userName, this.password, true)
            .subscribe(response => this.handleResponse(response));
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
                    console.log(this.labels);
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
        } else if (!response) {
            this.showToast("Nom d'usager ou mot de passe incorrect.");
        } else {
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

    public getAppVersion() {
       return this.authService.survipVersion;
    }

    public goToStore(){
        //TODO : Change survi-Mbile packageName for survi-Prevention
        //this.market.open(this.authService.survipName);
        this.market.open('id1026853728');
    }
}
