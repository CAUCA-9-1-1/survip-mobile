import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Events, Loading, LoadingController, Platform} from 'ionic-angular';
import {KeychainTouchId} from '@ionic-native/keychain-touch-id';
import {HttpService} from './http.service';
import {AppVersion} from "@ionic-native/app-version";
import config from '../../assets/config/config.json';
import {TranslateService} from '@ngx-translate/core';
import {Storage as OfflineStorage} from "@ionic/storage";
import {from} from "rxjs/observable/from";
import {switchMap} from "rxjs/operators";

export enum LoginResult {
  Ok,
  WrongPasswordOrUserName,
  ApiUnreachable
}

@Injectable()
export class AuthenticationService {
  public keychainTouchIdKey = 'survi%prevention%keychain';
  private loading: Loading;
  public survipVersion = '';
  public survipName = '';

  constructor(
    private storage: OfflineStorage,
    private http: HttpService,
    private loadingCtrl: LoadingController,
    private events: Events,
    private keychainTouchId: KeychainTouchId,
    private appVersion: AppVersion,
    private platform: Platform,
    private translateService: TranslateService
  ) {
  }

  public async userIsLoggedIn() {
    const user = await this.storage.get('auth');
    return (user != null && user.accessToken) ? true : false;
  }

  public login(username: string, password: string, saveKeychainTouchId = false): Promise<LoginResult> {

    return new Promise(async (resolve) => {
      await this.showLoading();

      this.http.rawPost('Authentification/Logon', {
        username: username,
        password: password,
      }, false)
        .subscribe(
          async (response) => {
            await this.saveResponse(response, saveKeychainTouchId ? {
              username: username,
              password: password,
            } : null);
            await this.dismissLoading();
            resolve(LoginResult.Ok);
          },
          async (error) => {
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
    this.loading = this.loadingCtrl.create({content: message});
    await this.loading.present();
  }

  public async dismissLoading() {
    if (this.loading != null) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }

  public async logout() {
    await this.storage.remove('auth');
  }

  private async saveResponse(result, userInfo) {
    await this.loading.dismiss();

    if (result.data) {
      if (result.data && result.data.accessToken) {
        await this.storage.set('auth', {
          'accessToken': result.data.accessToken,
          'refreshToken': result.data.refreshToken,
          'firstName': result.data.firstName,
          'lastName': result.data.lastName
        });
        this.saveKeychainTouchId(userInfo);
      }
    }
  }

  private saveKeychainTouchId(infoToSave) {
    if (infoToSave && "cordova" in window) {
      this.keychainTouchId.isAvailable().then(() => {
        this.keychainTouchId.save(this.keychainTouchIdKey, JSON.stringify(infoToSave)).then(() => {
          localStorage.setItem('biometricActivated', 'save');
        }).catch(error => {
          console.log('keychain-touch-id, can\'t saved information', error);
        });
      });
    }
  }

  public refreshTokenObservable(): Observable<any> {
    return from(this.storage.get('auth'))
      .pipe(
        switchMap(user => this.getRefreshedTokenFromApi(user))
      );
  }

  public async refreshToken(): Promise<Observable<any>> {
    const user = await this.storage.get('auth');
    return this.getRefreshedTokenFromApi(user);
  }

  private getRefreshedTokenFromApi(user) {
    return this.http.rawPost('Authentification/Refresh', {
      accessToken: user['accessToken'],
      refreshToken: user['refreshToken']
    }, false);
  }

  public async minimalVersionIsValid(): Promise<boolean> {
    if (!this.survipVersion) {
      await this.getAppConfiguration();
    }
    return this.http.get('Authentification/VersionValidator/' + this.survipVersion, false)
      .timeout(2000)
      .toPromise();
  }

  public async getVersion(): Promise<string> {
    if (!this.survipVersion) {
      await this.getAppConfiguration();
    }
    return this.survipVersion;
  }

  public async getAppConfiguration() {
    if ("cordova" in window) {
      this.survipVersion = await this.appVersion.getVersionNumber();
      if (this.platform.is('ios')) {
        this.survipName = 'id' + config.iosAppId;
      } else {
        this.survipName = await this.appVersion.getPackageName();
      }
    } else {
      this.survipVersion = '1.3.0';
      this.survipName = 'survi-prevention';
    }
  }
}
