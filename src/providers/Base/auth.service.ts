import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {
  Http,
  Response,
  Headers,
  XHRBackend, RequestOptions
} from '@angular/http';

import {AuthorizeRequestOptions} from './authorize-request-options';
import {ConfigService} from './config.service';
import {WindowRefService} from './window-ref.service';


@Injectable()
export class AuthService extends Http {
  private static isInLoginProcess = false;
  private storage: any;
  private location: any;
  private windowRef = new WindowRefService();
  protected apiUrl = '';

  constructor(
    backend: XHRBackend,
    defaultOptions: AuthorizeRequestOptions,
    config: ConfigService
  ) {
    super(backend, defaultOptions);

    this.apiUrl = config.getConfig('apiUrl');
    this.storage = this.windowRef.nativeObject('localStorage');
    this.storage.setItem('currentToken', '390c2aa1e4dee61c942e10614038b735339152205e1fd98ca0371ed4');
    this.location = this.windowRef.nativeObject('location');
  }

  public login(username?: string, password?: string): Observable<Response> {
    this.storage.removeItem('currentToken');

    if (username && password) {
      return this.put(
        'auth',
        JSON.stringify({
          username: username,
          password: password
        }),
        this.secretkey()
      ).map((response: Response) => {
        return response.json();
      });
    }

    return this.put(
      'auth',
      '',
      this.secretkey()
    ).map((response: Response) => {
      return response.json();
    });
  }

  public logout() {
    this.storage.removeItem('currentToken');
  }

  protected checkLogin(body: any) {
    if (body.error && body.login === false) {
      if (!AuthService.isInLoginProcess) {
        AuthService.isInLoginProcess = true;

        this.login().subscribe((infoToken) => {
          AuthService.isInLoginProcess = false;

          if (infoToken['data'].accessToken) {
            this.storage.setItem('currentToken', infoToken['data'].accessToken);
            this.reload();
          } else {
            this.location.href = '/login/';
          }
        });
      }
    }
  }

  private reload() {
    this.location.reload();
  }

  private secretkey() {
    const key = '5d98e9644cc8e3b1aea67e0c23c76b4c7ee3fb91546402fad725a15e';

    if (key) {
      return new RequestOptions({
        headers: new Headers({
          'Authorization': 'Key ' + key
        })
      });
    }
  }
}
