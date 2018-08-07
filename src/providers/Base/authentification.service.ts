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
    sessionStorage.removeItem('currentToken');
    this.showLoading();
    return this.http.post('Authentification/Logon', {
      username: username,
      password: password,
    }).pipe(
      map(response => this.onResponse(response))
    );
  }

  public async isStillLoggedIn() : Promise<boolean> {
    return this.http.get('Authentification/SessionStatus').pipe(
      map(response => {
        return response === true;
      })
    ).toPromise();
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({content: 'Please wait...'});
    this.loading.present();
  }

  public logout() {
    sessionStorage.clear();
  }

  private onResponse(result) {
    this.loading.dismiss();

    if (result.data && result.data.accessToken) {
      sessionStorage.setItem('firstName', result.data.firstName);
      sessionStorage.setItem('lastName', result.data.lastName);
      sessionStorage.setItem('currentToken', result.data.accessToken);
      sessionStorage.setItem('refreshToken', result.data.refreshToken);
      return result.data;
    }
    return result;
  }
}
