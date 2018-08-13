import {Component} from '@angular/core';
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {NavController} from "ionic-angular";

@Component({
    selector: 'menu-profile',
    templateUrl: 'menu-profile.html'
})
export class MenuProfileComponent {

    public fullName: string = '';

  constructor(private authentificationController : AuthenticationService, private navCtrl: NavController) {
    this.fullName = sessionStorage.getItem('firstName') + ' ' + sessionStorage.getItem('lastName');
  }

    public sessionLogout() {
        this.authentificationController.logout();
        this.navCtrl.setRoot('LoginPage');
    }
}
