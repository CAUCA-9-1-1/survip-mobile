import {Component} from '@angular/core';
import {AuthenticationService} from "../../providers/Base/authentification.service";
import {NavController} from "ionic-angular";

@Component({
    selector: 'menu-profile',
    templateUrl: 'menu-profile.html'
})
export class MenuProfileComponent {

    public fullName: string = '';
    public version: any = '';
    //public version = (<any>info).version;

  constructor(
    private authentificationController : AuthenticationService,
    private navCtrl: NavController) {
    this.version = authentificationController.survipVersion;
    this.fullName = authentificationController.firstName + ' ' + authentificationController.lastName;
  }

    public sessionLogout() {
        this.authentificationController.logout();
        this.navCtrl.setRoot('VersionValidatorPage');
    }
}
