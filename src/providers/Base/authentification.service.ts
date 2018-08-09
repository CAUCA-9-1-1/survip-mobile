import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from './http.service';
import {Events, Loading, LoadingController} from 'ionic-angular';
import {HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {

  private loading: Loading;

  constructor(
    private http: HttpService,
    private loadingCtrl: LoadingController,
    private events: Events) {
  }

  public login(username: string, password: string) {
    sessionStorage.removeItem('currentToken');
    this.showLoading();
    return this.http.rawPost('Authentification/Logon', {
      username: username,
      password: password,
    }).pipe(
      catchError((error: HttpErrorResponse) => Observable.of(false)),
      map(response => this.onResponse(response))
    );
  }

  public async isStillLoggedIn() : Promise<boolean> {
    return this.http.rawGet('Authentification/SessionStatus').pipe(
      map(response => {
        console.log(response);
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
      return true;
    }
    return false;
  }

  private onFailure(result){
    return Observable.of(false);
  }

  public refreshToken() {
    return this.http.rawPost('Authentification/Refresh', {
      accessToken: sessionStorage.getItem('currentToken'),
      refreshToken: sessionStorage.getItem('refreshToken')
    });
  }

  private onLogout(error) {
    sessionStorage.clear();
    this.events.publish('user:logout');
  }

  private onRefresh(response) {
    if (response.accessToken) {
      sessionStorage.setItem('currentToken', response.accessToken);
    }
  }
}
