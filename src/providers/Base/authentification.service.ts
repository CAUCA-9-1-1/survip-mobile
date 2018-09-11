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
    localStorage.removeItem('currentToken');

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
    return this.http.get('Authentification/SessionStatus').pipe(
        catchError((error: HttpErrorResponse, xhr: any) => {
            return Observable.of(false);
        }),
        map(response => response === true)
    ).toPromise();
  }

  private showLoading() {
    this.loading = this.loadingCtrl.create({content: 'Please wait...'});
    this.loading.present();
  }

  public logout() {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  }

  private onResponse(result) {
    this.loading.dismiss();

    if (result.data && result.data.accessToken) {
      localStorage.setItem('firstName', result.data.firstName);
      localStorage.setItem('lastName', result.data.lastName);

      localStorage.setItem('currentToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);

      return true;
    }
    return false;
  }

  private onFailure(result){
    return Observable.of(false);
  }

  public refreshToken() {
    return this.http.rawPost('Authentification/Refresh', {
      accessToken: localStorage.getItem('currentToken'),
      refreshToken: localStorage.getItem('refreshToken')
    });
  }

  private onLogout(error) {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    this.events.publish('user:logout');
  }

  private onRefresh(response) {
    if (response.accessToken) {
      localStorage.setItem('currentToken', response.accessToken);
    }
  }
}
