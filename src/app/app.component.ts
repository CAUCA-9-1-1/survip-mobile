import {Component, ViewChild} from '@angular/core';
import {Events, Nav, Platform, App, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';
import {HockeyApp} from 'ionic-hockeyapp';
import config from '../assets/config/config.json';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = (localStorage.getItem('biometricActivated') ? 'LoginPage' : 'LoginBiometricPage');
    @ViewChild(Nav) nav: Nav;

    constructor(
        private platform: Platform,
        private app: App,
        private hockeyApp: HockeyApp,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        translate: TranslateService,
        events: Events,
        toastCtrl: ToastController,
    ) {
        events.subscribe('user:logout', () => {
          this.nav.setRoot(this.rootPage);
        });

        events.subscribe('http:error', (error) => {
          var toast = toastCtrl.create({
            message: "Erreur: " + error,
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
            statusBar.styleLightContent();
            if (this.platform.is('android')) {
                statusBar.styleBlackOpaque();
            }
            splashScreen.hide();
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

