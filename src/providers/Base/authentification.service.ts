import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {Events, Loading, LoadingController, Platform} from 'ionic-angular';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {HttpService} from './http.service';
import {AppVersion} from "@ionic-native/app-version";

@Injectable()
export class AuthenticationService {
    public keychainTouchIdKey = 'survi%prevention%keychain';
    private loading: Loading;
    public survipVersion = '';
    public survipName= '';

    constructor(
        private http: HttpService,
        private loadingCtrl: LoadingController,
        private events: Events,
        private keychainTouchId: KeychainTouchId,
        private appVersion: AppVersion,
        private platform: Platform
    ) {
    }

    public login(username: string, password: string, saveKeychainTouchId = false) {
        localStorage.removeItem('currentToken');

        this.showLoading();
        return this.http.rawPost('Authentification/Logon', {
            username: username,
            password: password,
        }).pipe(
            catchError((error: HttpErrorResponse) => {
                this.loading.dismiss();
                return Observable.of(false);
            }),
            map(response => this.onResponse(response, saveKeychainTouchId ? {
                username: username,
                password: password,
            } : null))
        );
    }

    public async isStillLoggedIn() : Promise<boolean> {
        return this.http.get('Authentification/SessionStatus').pipe(
            catchError((error: HttpErrorResponse, xhr: any) => {
                return Observable.of(false);
            }),
            map(response => response === true)
        ).toPromise();
    }

    private showLoading() {
        this.loading = this.loadingCtrl.create({content: 'Please wait...'});
        this.loading.present();
    }

    public logout() {
        localStorage.removeItem('currentToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
    }

    private onResponse(result, userInfo) {
        this.loading.dismiss();

        if (result.data && result.data.accessToken) {
            this.saveKeychainTouchId(userInfo);

            localStorage.setItem('firstName', result.data.firstName);
            localStorage.setItem('lastName', result.data.lastName);

            localStorage.setItem('currentToken', result.data.accessToken);
            localStorage.setItem('refreshToken', result.data.refreshToken);

            return true;
        }

        return false;
    }

    private saveKeychainTouchId(infoToSave) {
        if (infoToSave && "cordova"in window) {
            this.keychainTouchId.isAvailable().then(biometricType => {
                this.keychainTouchId.save(this.keychainTouchIdKey, JSON.stringify(infoToSave)).then(result => {
                    localStorage.setItem('biometricActivated', 'save');

                    console.log('keychain-touch-id, saved information', result);
                }).catch(error => {
                    console.log('keychain-touch-id, can\'t saved information', error);
                });
            });
        }
    }

    private onFailure(result){
        return Observable.of(false);
    }

    public refreshToken() {
        return this.http.rawPost('Authentification/Refresh', {
            accessToken: localStorage.getItem('currentToken'),
            refreshToken: localStorage.getItem('refreshToken')
        });
    }

    private onLogout(error) {
        localStorage.removeItem('currentToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        this.events.publish('user:logout');
    }

    private onRefresh(response) {
        if (response.accessToken) {
            localStorage.setItem('currentToken', response.accessToken);
        }
    }

    public async MinimalVersionIsValid():Promise<boolean>{
        console.log("MinimalVersion : ",this.survipVersion);
        return this.http.get('Authentification/VersionValidator/' + this.survipVersion).toPromise().catch(()=>{return false;});
    }

    public async getAppConfiguration(){
        if("cordova"in window) {
            this.survipVersion = await this.appVersion.getVersionNumber();
            this.survipName = await this.appVersion.getPackageName();
            console.log('app information',this.survipVersion + ' | ' +this.survipName);
        }else{
            this.survipVersion = '0.0.8';
            this.survipName = 'survi-prevention';
        }
        console.log("App version : ",this.survipVersion);
    }

}
