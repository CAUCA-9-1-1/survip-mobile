import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Market} from "@ionic-native/market";
import {AuthenticationService} from "../../providers/Base/authentification.service";

@IonicPage()
@Component({
    selector: 'page-version-validator',
    templateUrl: 'version-validator.html',
})
export class VersionValidatorPage {
    rootPage: any = (localStorage.getItem('biometricActivated') ? 'LoginPage' : 'LoginBiometricPage');
    public storeLink = 'Google Play';
    public displayVersionWarning = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private platform: Platform,
                private market: Market,
                private authService: AuthenticationService,) {
        if (platform.is('ios')) {
            this.storeLink = 'App Store';
        }

        this.authService.showLoading();
    }

    public ionViewDidEnter() {
        this.validVersion();
    }

    public async validVersion() {
        this.authService.MinimalVersionIsValid()
            .then(result => {
                this.minimalVersionDisplay(result);
            })
            .catch(()=> {
                this.minimalVersionDisplay(true);
            });

    }

    private minimalVersionDisplay(redirect: boolean){
        if (redirect) {
            this.navCtrl.setRoot(this.rootPage);
        } else {
            this.displayVersionWarning = true;
        }
        this.authService.dismissLoading();
    }

    public goToStore() {
        this.market.open(this.authService.survipName);
    }

    public getAppVersion() {
        return this.authService.survipVersion;
    }

}
