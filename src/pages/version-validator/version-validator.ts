import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Market} from "@ionic-native/market";
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-version-validator',
    templateUrl: 'version-validator.html',
})
export class VersionValidatorPage {
    rootPage: any = (localStorage.getItem('biometricActivated') ? 'LoginPage' : 'LoginBiometricPage');
    public storeLink = 'Google Play';
    public displayWarning = false;
    public warningMessage = "";
    private labels = {};
    public displayStoreLink = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private platform: Platform,
                private market: Market,
                private authService: AuthenticationService,
                private translateService: TranslateService) {
        if (platform.is('ios')) {
            this.storeLink = 'App Store';
        }

        this.authService.showLoading();

        this.platform.ready().then(() => {
            this.platform.resume.subscribe(() => {
                this.validVersion();
                console.log("resume event",this.platform.resume);
            });
        });
    }

    public ngOnInit(){

        this.translateService.get([
            'versionInvalidWarning','serverDownMessage'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
        this.warningMessage = this.labels['versionInvalidWarning'];
    }

    public ionViewDidEnter() {
        this.validVersion();
    }

    public async validVersion() {
        this.authService.minimalVersionIsValid()
            .then(result => {
                this.minimalVersionDisplay(result);
            })
            .catch(()=> {
                this.serverDownDisplay();
            });

    }

    private serverDownDisplay(){
        this.displayStoreLink = false;
        this.minimalVersionDisplay(false);
        this.warningMessage = this.labels['serverDownMessage'];
    }

    private minimalVersionDisplay(redirect: boolean){
        if (redirect) {
            this.navCtrl.setRoot(this.rootPage);
        } else {
            this.displayWarning = true;
        }
        this.authService.dismissLoading();
    }

    public goToStore() {
        this.market.open(this.authService.survipName);
    }

    public getAppVersion() {
        return this.authService.survipVersion;
    }

    public reTryVersionValidation(){
        this.validVersion();
    }

}
