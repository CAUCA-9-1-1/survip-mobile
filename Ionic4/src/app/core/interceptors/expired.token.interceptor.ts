import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, from} from 'rxjs';
import {Injectable, Injector} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import {switchMap} from 'rxjs/operators';
import { Events } from '@ionic/angular';

@Injectable()
export class ExpiredTokenInterceptor implements HttpInterceptor {

  private isRefreshingToken: boolean = false;
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private injector: Injector, private storage: OfflineStorage) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.getToken())
      .pipe(
        switchMap(
          token => {
            if (this.requestIsForAuthentication(req)) {
              return next.handle(this.setToken(req, token));
            } else {
              return next.handle(this.setToken(req, token))
                .catch(error => {
                  if (error instanceof HttpErrorResponse && !this.requestIsForAuthentication(req) && (<HttpErrorResponse>error).status == 401) {
                    console.log('Expired access token intercepted.');
                    return this.refreshToken(req, next);
                  } else {
                    return Observable.throw(error);
                  }
                });
            }
          }
        )
      );
  }

  private requestIsForAuthentication(authRequest) {
    return authRequest.url.indexOf('Authentification') >= 0;
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);
      const authService = this.injector.get(AuthenticationService);

      return authService.refreshTokenObservable()
        .switchMap((response) => this.onTokenRefreshed(response, req, next))
        .catch((error) => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          console.log('an error has occured while refreshing the token.', error);
          this.isRefreshingToken = false;
          return this.onLogout();
        })
        .finally(() => {
          this.isRefreshingToken = false;
        });
    } else {
      return this.getRequestWithToken(req, next);
    }
  }

  private getRequestWithToken(req: HttpRequest<any>, next: HttpHandler) {
    return this.tokenSubject
      .filter(token => token != null)
      .take(1)
      .switchMap((token) => {
        const request = this.setToken(req, token);
        return next.handle(request);
      });
  }

  private onLogout() {
    return from(this.clearLoginInfos())
      .pipe(switchMap(() => Observable.throw('')));
  }

  private async clearLoginInfos() {
    await this.storage.remove('auth');
    const events = this.injector.get(Events);
    events.publish('user:logout');
  }

  private async getToken(): Promise<string> {
    const auth = await this.storage.get('auth');
    return auth ? auth.accessToken : '';
  }

  private onTokenRefreshed(response, req, next) {
    if (!response.accessToken) {
      this.isRefreshingToken = false;
      return this.onLogout();
    } else {
      return from(this.saveToken(response.accessToken))
        .pipe(
          switchMap(() => {
            this.tokenSubject.next(response.accessToken);
            return this.getRequestWithToken(req, next);
          })
        )
    }
  }

  private async saveToken(accessToken: string): Promise<boolean> {
    const auth = await this.storage.get('auth');
    auth.accessToken = accessToken;
    await this.storage.set('auth', auth);
    return true;
  }

  private setToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }});
  }
}
