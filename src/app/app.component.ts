import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'LoginPage';

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translate: TranslateService) {
        platform.ready().then(() => {
            statusBar.styleDefault();
            if (platform.is('android')) {
                statusBar.styleBlackOpaque();
            }
            splashScreen.hide();
            translate.setDefaultLang('fr');
            translate.use('en');
        });
    }
}

