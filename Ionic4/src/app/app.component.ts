import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/services/authentication/authentification.service';
import { TranslateService } from '@ngx-translate/core';
// import { Config } from '@ionic/core';
import { Config } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // public rootPage: any = '';

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private config: Config,
    private translate: TranslateService,
    public authenticationService: AuthenticationService
  ) {
    this.initializeApp();
  }

  async initializeApp() {

    this.translate.setDefaultLang('fr');
    if (window.navigator.language.startsWith('en')) {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }

    this.platform.ready().then(() => {
      this.translate.get('navigationBack').subscribe(backLabel => {
          this.config.set('backButtonText', backLabel);
      });
      this.statusBar.styleLightContent();
      if (this.platform.is('android')) {
          this.statusBar.styleBlackOpaque();
      }
      this.splashScreen.hide();
      this.authenticationService.getAppConfiguration();
  });

    if (await this.authenticationService.isLoggedIn()) {
      console.log('logged in motherfucka');
    } else {
      console.log('unlogged, motherfucka');
    }
  }
}
