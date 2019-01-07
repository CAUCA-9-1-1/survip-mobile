import {Component, ViewChild} from '@angular/core';
import {Events, Nav, Platform, App, ToastController, Config} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';
import {HockeyApp} from 'ionic-hockeyapp';
import {AuthenticationService} from "../providers/Base/authentification.service";
import config from '../assets/config/config.json';
import { Storage as DataStorage } from '@ionic/storage';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'VersionValidatorPage';
    @ViewChild(Nav) nav: Nav;

    constructor(
        private storage: DataStorage,
        private platform: Platform,
        private app: App,
        private config: Config,
        private hockeyApp: HockeyApp,
        private authService: AuthenticationService,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private translate: TranslateService,
        events: Events,
        toastCtrl: ToastController,
    ) {
        events.subscribe('user:logout', () => {
          this.nav.setRoot(this.rootPage);
        });

        events.subscribe('http:error', (error) => {
          var toast = toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
        });

        translate.setDefaultLang('fr');
        if(window.navigator.language.startsWith('en')) {
            translate.setDefaultLang('en');
            translate.use('en');
        }

        platform.ready().then(() => {

            console.log('driver: ', this.storage.driver);

            this.translate.get('navigationBack').subscribe(backLabel => {
              this.config.set('ios', 'backButtonText', backLabel)
            });
            statusBar.styleLightContent();
            if (this.platform.is('android')) {
                statusBar.styleBlackOpaque();
            }
            splashScreen.hide();
          this.authService.getAppConfiguration();
            this.enableHockeyApp();
        });
    }

    private enableHockeyApp() {
        const androidAppId = config.hockeyapp.androidAppId === 'YOUR_ANDROID_HOCKEYAPP_ID' ? null : config.hockeyapp.androidAppId;
        const iosAppId = config.hockeyapp.iosAppId === 'YOUR_IOS_HOCKEYAPP_ID' ? null : config.hockeyapp.iosAppId;

        if (androidAppId || iosAppId) {
            this.hockeyApp.start(
                androidAppId,
                iosAppId,
                config.hockeyapp.autoSendCrashReports,
                config.hockeyapp.ignoreCrashDialog
            );
            this.hockeyApp.trackEvent('SURVI-Prevention start');
        }
    }
}

