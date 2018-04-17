import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Loading, LoadingController} from 'ionic-angular';

@Injectable()
export class AuthenticationService {
  private loading: Loading;
  constructor(private http: HttpService, private loadingCtrl: LoadingController) {
  }

  public login(username: string, password: string) {
    localStorage.removeItem('currentToken');
    this.showLoading();
    return this.http.post('Authentification/Logon?user=' + username + '&password=' + password, {
      username: username,
      password: password,
    }).pipe(
      map(response => this.onResponse(response))
    );
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({content: 'Please wait...'});
    this.loading.present();
  }

  public logout() {
    localStorage.removeItem('currentToken');
  }

  private onResponse(result) {
    this.loading.dismiss();

    if (result.data && result.data.accessToken) {
      localStorage.setItem('currentToken', result.data.accessToken);
      return result.data;
    }
    return result;
  }
}
