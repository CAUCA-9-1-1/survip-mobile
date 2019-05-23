import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Storage as OfflineStorage } from '@ionic/storage';
import { switchMap, catchError, take, filter } from 'rxjs/operators';
import { Events } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication/authentification.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  private isRefreshingToken: boolean = false;
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private authService: AuthenticationService;

  constructor(private injector: Injector, private storage: OfflineStorage) {
    this.authService = this.injector.get(AuthenticationService);
    console.log('Euhhh', this.authService.userAccessToken);
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

    const token = this.authService.userAccessToken;

    if (this.requestIsForAuthentication(req)) {
      return next.handle(this.setToken(req, token));
    } else {
      return next.handle(this.setToken(req, token))
        .pipe(
          catchError(error => {
            if (error instanceof HttpErrorResponse
              && !this.requestIsForAuthentication(req)
              && (error as HttpErrorResponse).status === 401) {
              console.log('Expired access token intercepted.');
              return this.refreshToken(req, next);
            } else {
              return throwError(error);
            }
          })
        );
    }
  }

  private requestIsForAuthentication(authRequest) {
    return authRequest.url.indexOf('Authentification') >= 0;
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);

      return this.authService.refreshToken()
        .pipe(
          switchMap((hasBeenRefreshed) => {
            this.isRefreshingToken = false;
            if (hasBeenRefreshed) {
              return this.onTokenRefreshed(this.authService.userAccessToken, req, next);
            } else {
              return this.onLogout();
            }
          })
        );
    } else {
      return this.getRequestWithToken(req, next);
    }
  }

  private getRequestWithToken(req: HttpRequest<any>, next: HttpHandler) {
    return this.tokenSubject
      .pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => {
          const request = this.setToken(req, token);
          return next.handle(request);
        })
      );
  }

  private onLogout() {
    return from(this.clearLoginInfos())
      .pipe(switchMap(() => throwError('')));
  }

  private async clearLoginInfos() {
    await this.storage.remove('auth');
    const events = this.injector.get(Events);
    events.publish('user:logout');
  }

  private onTokenRefreshed(newAccessToken, req, next) {
    this.tokenSubject.next(newAccessToken);
    return this.getRequestWithToken(req, next);
  }

  private setToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }
}
