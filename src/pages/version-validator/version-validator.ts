import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {Market} from "@ionic-native/market";
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {ISubscription} from "rxjs/Subscription";
import {TimeoutError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

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
    public displayStoreLink = true;
    private resumeSubscription: ISubscription;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private platform: Platform,
                private market: Market,
                private authService: AuthenticationService) {
      if (platform.is('ios')) {
        this.storeLink = 'App Store';
      }

      try {

          this.warningMessage = 'versionInvalidWarning';
          this.platform.ready().then(() => {
                  this.resumeSubscription = this.platform.resume.subscribe(() => {
                      this.validVersion();
                  });

              },
              error => {
                  console.log(error)
              });
      } catch (e) {
        console.log('error version validator constructor', e);
      }
    }

    public ngOnInit(){
    }

    public async ionViewDidEnter() {
        await this.validVersion();
    }

    public async validVersion() {
      await this.authService.showLoading();
      this.authService.minimalVersionIsValid()
        .then(async(result) => {
          await this.minimalVersionDisplay(result);
        })
        .catch(async (error) => {
          if (error instanceof TimeoutError || (error instanceof HttpErrorResponse && error.status === 0)) {
            await this.minimalVersionDisplay(true);
          } else {
            await this.serverDownDisplay();
          }
        });
      if (this.resumeSubscription) {
        this.resumeSubscription.unsubscribe();
      }
    }

    private async serverDownDisplay() {
      this.displayStoreLink = false;
      await this.minimalVersionDisplay(false);
      this.warningMessage = 'serverDownMessage';
    }

    private async minimalVersionDisplay(redirect: boolean) {
      await this.authService.dismissLoading();
      if (redirect) {
        await this.navCtrl.setRoot(this.rootPage);
      } else {
        this.displayWarning = true;
      }
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
