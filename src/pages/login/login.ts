import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AuthenticationService} from '../../providers/Base/authentification.service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public userName: string;
  public password: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthenticationService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewCanEnter(){
    if (localStorage.getItem('currentToken'))
      console.log('ouiiiii');
    else
      console.log('nooooon');

  }


  public onLogin(){
    console.log(this.userName, this.password);
    this.authService.login(this.userName, this.password)
      .subscribe(response => console.log(response));
  }
}
