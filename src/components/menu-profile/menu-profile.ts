import {Component} from '@angular/core';
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {NavController} from "ionic-angular";
import * as info from '../../../package.json';

@Component({
    selector: 'menu-profile',
    templateUrl: 'menu-profile.html'
})
export class MenuProfileComponent {

    public fullName: string = '';
    public version = (<any>info).version;

  constructor(private authentificationController : AuthenticationService, private navCtrl: NavController) {
    this.fullName = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
  }

    public sessionLogout() {
        this.authentificationController.logout();
        this.navCtrl.setRoot('VersionValidatorPage');
    }
}
