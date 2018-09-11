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
    private keychainTouchIdKey = 'survi-prevention';
    private keychainTouchIdPassword = 'password%survi%prevention%keychain%touch%id';

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

    public ngOnInit() {
        this.translateService.get([
            'loginError'
        ]).subscribe(labels => {
            this.labels = labels;
        }, error => {
            console.log(error)
        });
    }

    async ionViewCanEnter() {
        if (localStorage.getItem('currentToken')) {
            let isLoggedIn = await this.authService.isStillLoggedIn();
            if (isLoggedIn) {
                this.redirectToInspectionList();
            } else {
                this.validateKeychainTouchId();
            }
        }
    }

    public onLogin() {
        this.authService.login(this.userName, this.password)
            .subscribe(response => this.handleResponse(response));
    }

    public onKeyPress(keyCode) {
        if (keyCode == 13)
            this.onLogin();
    }

    private handleResponse(response) {
        if (localStorage.getItem('currentToken')) {
            this.keychainTouchId.isAvailable().then(result => {
                this.saveKeychainTouchId();
            }).catch(errror => {
                this.redirectToInspectionList();
            });
        } else if (!response) {
            this.showToast("Nom d'usager ou mot de passe incorrect.");
        } else {
            this.showToast("Problème de communication avec le serveur.  Veuillez communiquer avec un adminstrateur.");
        }
    }

    private validateKeychainTouchId() {
        this.keychainTouchId.isAvailable().then(result => {
            this.keychainTouchId.has(this.keychainTouchIdKey).then(result => {
                this.keychainTouchId.verify(this.keychainTouchIdKey, 'test')
                    .then(result => console.log(result))
                    .catch(error => console.log(error));
            });
        });
    }

    private saveKeychainTouchId() {
        this.keychainTouchId.has(this.keychainTouchIdKey).then(result => {
            this.redirectToInspectionList();
        }).catch(error => {
            this.keychainTouchId.save(this.keychainTouchIdKey, this.keychainTouchIdPassword).then(result => {
                this.redirectToInspectionList();
            }).catch(error => {
                console.log('error when saving touch id');
            });
        });
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
