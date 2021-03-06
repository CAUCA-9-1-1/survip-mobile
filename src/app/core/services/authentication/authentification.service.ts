import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { Platform, LoadingController } from '@ionic/angular';
import { Storage as OfflineStorage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, from } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import config from '../../../../assets/config/config.json';
import { HttpService } from '../base/http.service';

export enum LoginResult {
    Ok,
    WrongPasswordOrUserName,
    ApiUnreachable
}

@Injectable({providedIn: 'root'})
export class AuthenticationService {
    public keychainTouchIdKey = 'survi%prevention%keychain';
    private loading: HTMLIonLoadingElement;
    public survipVersion = '';
    public survipName = '';

    public userFullName: string = '';
    public userRefreshToken: string;
    public userAccessToken: string;

    constructor(
        private storage: OfflineStorage,
        private http: HttpService,
        private loadingCtrl: LoadingController,
        private keychainTouchId: KeychainTouchId,
        private appVersion: AppVersion,
        private platform: Platform,
        private translateService: TranslateService
    ) {
    }

    public async initialize() {
        const user = await this.storage.get('auth');
        if (user != null) {
            if (user.name) {
                this.userFullName = user.name;
            }
            this.userAccessToken = user.accessToken;
            this.userRefreshToken = user.refreshToken;
        }
    }

    private async userIsLoggedIn() {
        return (this.userAccessToken) ? true : false;
    }

    public login(username: string, password: string, saveKeychainTouchId = false): Promise<LoginResult> {

        return new Promise(async (resolve) => {
            await this.showLoading();

            this.http.rawPost('Authentification/Logon', {
                username, password,
            }, false)
                .subscribe(
                    async (response) => {
                        await this.saveResponse(response, saveKeychainTouchId ? {
                            username, password,
                        } : null);
                        await this.dismissLoading();
                        resolve(LoginResult.Ok);
                    },
                    async (error) => {
                        console.log('erreur', error);
                        await this.dismissLoading();
                        if (error.status === 401) {
                            resolve(LoginResult.WrongPasswordOrUserName);
                        } else if (await this.userIsLoggedIn()) {
                            resolve(LoginResult.Ok);
                        } else {
                            resolve(LoginResult.ApiUnreachable);
                        }
                    }
                );
        });
    }

    public async isLoggedIn(): Promise<boolean> {
        await this.initialize();
        return this.isStillLoggedIn();
    }

    public isStillLoggedIn(): Promise<boolean> {
        return new Promise((resolve) => {

            this.http.rawGet('Authentification/SessionStatus')
                .subscribe(
                    () => {
                        resolve(true);
                        console.log('Still logged in!');
                    },
                    async (error) => {
                        const userWasLoggedIn = await this.userIsLoggedIn();
                        if (error.status === 0 && userWasLoggedIn) {
                            console.log('No API, but logged in.');
                            resolve(true);
                        } else {
                            console.log('Not logged in.', error.status);
                            resolve(false);
                        }
                    },
                );
        });
    }

    public async showLoading() {
        const message = await this.translateService.get('waitFormMessage').toPromise();
        this.loading = await this.loadingCtrl.create({ message });
        await this.loading.present();
    }

    public async dismissLoading() {
        if (this.loading != null) {
            await this.loading.dismiss();
            this.loading = null;
        }
    }

    public async logout() {
        this.userFullName = '';
        this.userAccessToken = null;
        this.userRefreshToken = null;
        await this.storage.remove('auth');
    }

    private async saveResponse(result, userInfo) {
        await this.loading.dismiss();
        if (result.data) {
            if (result.data && result.data.accessToken) {
                this.userFullName = result.data.firstName + ' ' + result.data.lastName;
                this.userAccessToken = result.data.accessToken;
                this.userRefreshToken = result.data.refreshToken;
                await this.storage.set('auth', {
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
                    name: this.userFullName
                });
                this.saveKeychainTouchId(userInfo);
            }
        } else if (result && result.accessToken) {
            this.userFullName = result.name;
            this.userAccessToken = result.accessToken;
            this.userRefreshToken = result.refreshToken;
            await this.storage.set('auth', {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                name: result.name
            });
            this.saveKeychainTouchId(userInfo);
        }
    }

    private saveKeychainTouchId(infoToSave) {
        if (infoToSave && 'cordova' in window) {
            this.keychainTouchId.isAvailable().then(() => {
                this.keychainTouchId.save(this.keychainTouchIdKey, JSON.stringify(infoToSave)).then(() => {
                    localStorage.setItem('biometricActivated', 'save');
                }).catch(error => {
                    console.log('keychain-touch-id, can\'t saved information', error);
                });
            });
        }
    }

    public clearKeychainTouchId() {
        if ('cordova' in window) {
            this.keychainTouchId.isAvailable().then(() => {
                this.keychainTouchId.delete(this.keychainTouchIdKey)
                    .then(() => {
                        localStorage.removeItem('biometricActivated');
                    });
            });
        }
    }

    public refreshToken(): Observable<boolean> {
        return this.getRefreshedTokenFromApi()
            .pipe(
                flatMap(response => from(this.saveToken(response.accessToken).then(() => true))),
                catchError(error => of(false))
            );
    }

    private async saveToken(accessToken: string): Promise<boolean> {
        const auth = await this.storage.get('auth');
        auth.accessToken = accessToken;
        this.userAccessToken = accessToken;
        await this.storage.set('auth', auth);
        return true;
    }

    private getRefreshedTokenFromApi(): Observable<any> {
        return this.http.rawPost('Authentification/Refresh', {
            accessToken: this.userAccessToken,
            refreshToken: this.userRefreshToken
        }, false);
    }

    public async minimalVersionIsValid(): Promise<boolean> {
        if (!this.survipVersion) {
            await this.getAppConfiguration();
        }
        return this.http.get('Authentification/VersionValidator/' + this.survipVersion, false)
            .toPromise();
    }

    public async getVersion(): Promise<string> {
        if (!this.survipVersion) {
            await this.getAppConfiguration();
        }
        return this.survipVersion;
    }

    public async getAppConfiguration() {
        if ('cordova' in window) {
            this.survipVersion = await this.appVersion.getVersionNumber();
            if (this.platform.is('ios')) {
                this.survipName = 'id' + config.iosAppId;
            } else {
                this.survipName = await this.appVersion.getPackageName();
            }
        } else {
            this.survipVersion = '1.9.3';
            this.survipName = 'survi-prevention';
        }
    }
}

