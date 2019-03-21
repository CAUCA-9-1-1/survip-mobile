import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Market} from "@ionic-native/market";
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {TranslateService} from "@ngx-translate/core";
import {ISubscription} from "rxjs/Subscription";
import {TimeoutError} from "rxjs";

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
    private resumeSubscription: ISubscription;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private platform: Platform,
                private market: Market,
                private authService: AuthenticationService,
                private translateService: TranslateService) {
        if (platform.is('ios')) {
            this.storeLink = 'App Store';
        }

        try {
        this.platform.ready().then(() => {
            this.resumeSubscription = this.platform.resume.subscribe(() => {
                this.validVersion();
            });
        });
        }catch(e){
            console.log('error version validator constructor', e);
        }
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
        this.authService.showLoading();
        this.authService.minimalVersionIsValid()
            .then(result => {
                this.minimalVersionDisplay(result);
            })
            .catch((error)=> {
              if (error instanceof TimeoutError) {
                this.minimalVersionDisplay(true);
              } else {
                this.serverDownDisplay();
              }
            });
        if(this.resumeSubscription) {
            this.resumeSubscription.unsubscribe();
        }
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
