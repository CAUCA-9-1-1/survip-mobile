import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    public userName: string;
    public password: string;
    public labels = {};

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private authService: AuthenticationService,
        private toastCtrl: ToastController,
        private translateService: TranslateService) {
    }

    public ngOnInit() {
        this.translateService.get([
            'loginError'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public async ionViewCanEnter() {
        if (localStorage.getItem('currentToken')) {
            let isLoggedIn = await this.authService.isStillLoggedIn();
            if (isLoggedIn)
                this.redirectToInspectionList();
        }
    }

    public onLogin() {
        this.authService.login(this.userName, this.password)
            .subscribe(response => this.handleResponse(response));
    }

    public onKeyPress(keyCode) {
        if (keyCode == 13)
            this.onLogin();
    }

    private handleResponse(response) {
        if (localStorage.getItem('currentToken'))
            this.redirectToInspectionList();
        else if (response.status && response.status == 401)
            this.showToast(this.labels['loginError']);
        else
            this.showToast("Problème de communication avec le serveur.  Veuillez communiquer avec un adminstrateur.");
    }

    private showToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });

        toast.present();
    }

    private redirectToInspectionList() {
        this.navCtrl.push('HomePage');
    }
}
