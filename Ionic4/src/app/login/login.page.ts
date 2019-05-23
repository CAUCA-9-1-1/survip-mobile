import { Component, OnInit } from '@angular/core';
import { AuthenticationService, LoginResult } from '../core/services/authentication/authentification.service';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userName: string;
  public password: string;
  public labels = {};
  public version = '';

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private toastCtrl: ToastController,
    private translateService: TranslateService,
    private keychainTouchId: KeychainTouchId,
  ) { }

  async ngOnInit() {
    this.version = await this.authService.getVersion();

    if (await this.authService.isStillLoggedIn()) {
      return this.redirectToInspectionList();
    }

    this.translateService.get([
      'loginError', 'biometric.confirmYourFingerprint', 'loginCommunicationError'
    ]).subscribe(labels => {
      this.labels = labels;

      const biometricEnabled = localStorage.getItem('biometricActivated') === 'save' ? true : false;
      if (biometricEnabled) {
        this.validateKeychainTouchId();
      }
    }, error => {
      console.log(error);
    });
  }

  public test() {
    console.log('log out you');
    this.authService.logout();
  }

  public async onLogin() {
    this.test();
    const result = await this.authService.login(this.userName, this.password, true);
    this.handleLoginResult(result);
  }

  public async onKeyPress(keyCode) {
    if (keyCode === 13) {
      await this.onLogin();
    }
  }

  private validateKeychainTouchId() {
    if ('cordova' in window) {
      this.keychainTouchId.isAvailable().then(biometricType => {
        this.keychainTouchId.has(this.authService.keychainTouchIdKey).then(result => {
          console.log('keychain-touch-id, has key', result);
          this.keychainTouchId.verify(this.authService.keychainTouchIdKey, this.labels['biometric.confirmYourFingerprint'])
            .then(async (saveInfo) => {
              const user = JSON.parse(saveInfo);
              const loginResult = await this.authService.login(user.username, user.password, false);
              this.handleLoginResult(loginResult, true);
            })
            .catch(error => {
              console.log('keychain-touch-id, can\'t verify the key', error);
            });
        }).catch(error => {
          console.log('keychain-touch-id, key doesn\'t exist', error);
        });
      }).catch(error => {
        console.log('keychain-touch-id, is not available', error);
      });
    }
  }

  private async handleLoginResult(result: LoginResult, inBiometricLogin: boolean = false) {
    if (result === LoginResult.Ok) {
      this.redirectToInspectionList();
    } else if (result === LoginResult.WrongPasswordOrUserName) {
      if (inBiometricLogin) {
        this.authService.clearKeychainTouchId();
      }
      await this.showToast(this.labels['loginError']);
    } else {
      await this.showToast(this.labels['loginCommunicationError']);
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });

    await toast.present();
  }

  private async redirectToInspectionList() {
    this.router.navigate(['inspections']);
  }
}
