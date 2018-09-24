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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private platform: Platform,
                private market: Market,
                private authService: AuthenticationService,) {
        if (platform.is('ios')) {
            this.storeLink = 'App Store';
        }
    }

    public ionViewDidEnter(){
        this.validVersion();
    }

    public async validVersion() {
        let minimalVersionValid = await this.authService.MinimalVersionIsValid();
        if (minimalVersionValid) {
            this.navCtrl.push(this.rootPage);
        }
    }

    public goToStore() {
        this.market.open(this.authService.survipName);
    }

    public getAppVersion() {
        return this.authService.survipVersion;
    }

}
