import {Component, ViewChild} from '@angular/core';
import {Events, Nav, Platform, App, ToastController, Config} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from '@ngx-translate/core';
import {AuthenticationService} from "../providers/Base/authentification.service";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'VersionValidatorPage';
    @ViewChild(Nav) nav: Nav;

    constructor(
        private platform: Platform,
        private app: App,
        private config: Config,
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

        /* temporarily commented, we'll see later if we need to keep this code.

        events.subscribe('http:error', (error) => {
          var toast = toastCtrl.create({
            message: error,
            duration: 3000
          });
          toast.present();
        });*/

        translate.setDefaultLang('fr');
        if(window.navigator.language.startsWith('en')) {
            translate.setDefaultLang('en');
            translate.use('en');
        }

        platform.ready().then(() => {
            this.translate.get('navigationBack').subscribe(backLabel => {
                this.config.set('ios', 'backButtonText', backLabel)
            });
            statusBar.styleLightContent();
            if (this.platform.is('android')) {
                statusBar.styleBlackOpaque();
            }
            splashScreen.hide();
            this.authService.getAppConfiguration();
        });
    }
}

