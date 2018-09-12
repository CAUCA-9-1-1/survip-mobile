import {Component, ViewChild} from '@angular/core';
import {Events, Nav, Platform, App, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';
import {HockeyApp} from 'ionic-hockeyapp';

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
        const androidAppId = 'bbfb228ed1114902902ed514c632a149';
        const iosAppId = 'd08a72d4d7184a28a700d12c4061386f';
        const autoSendCrashReports = true;
        const ignoreCrashDialog = true;
        this.hockeyApp.start(androidAppId, iosAppId, autoSendCrashReports, ignoreCrashDialog);
        this.hockeyApp.trackEvent('SURVI-Prevention start');

        // So app doesn't close when hockey app activities close
        // This also has a side effect of unable to close the app when on the rootPage and using the back button.
        // Back button will perform as normal on other pages and pop to the previous page.
        this.platform.registerBackButtonAction(() => {
            let nav = this.app.getRootNav();
            if (nav.canGoBack()) {
                nav.pop();
            } else {
                nav.setRoot(this.rootPage);
            }
        });
    }
}

