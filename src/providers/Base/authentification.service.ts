import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import { Events, Loading, LoadingController, Platform} from 'ionic-angular';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {HttpService} from './http.service';
import {AppVersion} from "@ionic-native/app-version";
import config from '../../assets/config/config.json';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class AuthenticationService {
    public keychainTouchIdKey = 'survi%prevention%keychain';
    private loading: Loading;
    public survipVersion = '';
    public survipName = '';
    public survipAppId = '';

    constructor(
        private http: HttpService,
        private loadingCtrl: LoadingController,
        private events: Events,
        private keychainTouchId: KeychainTouchId,
        private appVersion: AppVersion,
        private platform: Platform,
        private translateService: TranslateService
    ) {
    }

    public login(username: string, password: string, saveKeychainTouchId = false) {
        localStorage.removeItem('currentToken');

        this.showLoading();
        return this.http.rawPost('Authentification/Logon', {
            username: username,
            password: password,
        }, false).pipe(
            catchError((error: HttpErrorResponse) => {
                this.loading.dismiss();
                return Observable.of(error);
            }),
            map(response => this.onResponse(response, saveKeychainTouchId ? {
                username: username,
                password: password,
            } : null))
        );
    }

    public async isStillLoggedIn() : Promise<boolean> {
        return this.http.get('Authentification/SessionStatus', false).pipe(
            catchError((error: HttpErrorResponse, xhr: any) => {
                return Observable.of(false);
            }),
            map(response => response === true)
        ).toPromise();
    }

    public showLoading() {
      this.translateService.get('waitFormMessage')
        .subscribe(message => {
          this.loading = this.loadingCtrl.create({content: message});
          this.loading.present();
        }, error => console.log(error));
    }

    public dismissLoading(){
      this.loading.dismiss();
    }

    public logout() {
        localStorage.removeItem('currentToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
    }

    private onResponse(result, userInfo) {
        this.loading.dismiss();

        if(result.data) {
            if (result.data && result.data.accessToken) {
                this.saveKeychainTouchId(userInfo);

                localStorage.setItem('firstName', result.data.firstName);
                localStorage.setItem('lastName', result.data.lastName);

                localStorage.setItem('currentToken', result.data.accessToken);
                localStorage.setItem('refreshToken', result.data.refreshToken);

                return {status:200, ok:true};
            }
            return  {status:200, ok:false};
        }
        return result;
    }

    private saveKeychainTouchId(infoToSave) {
        if (infoToSave && "cordova"in window) {
            this.keychainTouchId.isAvailable().then(() => {
                this.keychainTouchId.save(this.keychainTouchIdKey, JSON.stringify(infoToSave)).then(() => {
                    localStorage.setItem('biometricActivated', 'save');
                }).catch(error => {
                    console.log('keychain-touch-id, can\'t saved information', error);
                });
            });
        }
    }

    public refreshToken() {
        return this.http.rawPost('Authentification/Refresh', {
            accessToken: localStorage.getItem('currentToken'),
            refreshToken: localStorage.getItem('refreshToken')
        }, false);
    }

    public async minimalVersionIsValid():Promise<boolean>{
        if(!this.survipVersion) {
            await this.getAppConfiguration();
        }
        return this.http.get('Authentification/VersionValidator/' + this.survipVersion, false)
            .timeout(2000)
            .toPromise();
    }

    public async getAppConfiguration(){
        if("cordova"in window) {
            this.survipVersion = await this.appVersion.getVersionNumber();
            if(this.platform.is('ios')){
                this.survipName = 'id'+config.iosAppId;
            }else {
                this.survipName = await this.appVersion.getPackageName();
            }
        }else{
            this.survipVersion = '1.3.0';
            this.survipName = 'survi-prevention';
        }
    }
}
