import {Component, ViewChild} from '@angular/core';
import {Events, Nav, NavController, Platform, ToastController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {TranslateService} from "@ngx-translate/core";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = 'LoginPage';
    @ViewChild(Nav) nav: Nav;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, translate: TranslateService, events: Events, toastCtrl: ToastController) {

        events.subscribe('user:logout', () => {
          this.nav.setRoot('LoginPage');
        });

        events.subscribe('http:error', (error) => {
          var toast = toastCtrl.create({
            message: "Erreur: " + error,
            duration: 3000
          });
          toast.present();
        })

        platform.ready().then(() => {
            statusBar.styleLightContent();
            if (platform.is('android')) {
                statusBar.styleBlackOpaque();
            }
            splashScreen.hide();
            console.log(window.navigator.language);
            translate.setDefaultLang('fr');
            if(window.navigator.language.startsWith("en")) {
                translate.setDefaultLang('en');
                translate.use('en');
            }
        });
    }
}

