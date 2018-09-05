import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Injectable, Injector} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {AuthenticationService} from './authentification.service';
import {Events} from 'ionic-angular';

@Injectable()
export class ExpiredTokenInterceptor implements HttpInterceptor {

  private isRefreshingToken: boolean = false;
  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private injector: Injector) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authRequest = req.clone();

    return next.handle(this.setToken(authRequest))
      .catch(error => {
        if (error instanceof HttpErrorResponse && authRequest.url.indexOf('Authentification/') < 0 && (<HttpErrorResponse>error).status == 401) {
          console.log('Intercepted request!');

          return this.refreshToken(authRequest, next);
        } else {
          return Observable.throw(error);
        }
      });
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.tokenSubject.next(null);
      const authService = this.injector.get(AuthenticationService);

      return authService.refreshToken()
        .switchMap((response) => {
          this.onTokenRefreshed(response);
          if (localStorage.getItem("currentToken")){
            this.tokenSubject.next(localStorage.getItem("currentToken"));
            this.isRefreshingToken = false;
            return next.handle(this.setToken(req));
          }
          return this.onLogout();
        })
        .catch(() => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          this.isRefreshingToken = false;
          return this.onLogout();
        })
        .finally(() => {
          this.isRefreshingToken = false;
        });
    } else {
      return this.tokenSubject
        .filter(token => token != null)
        .take(1)
        .switchMap(token => {
          return next.handle(this.setToken(req));
        });
    }
  }

  private onLogout() {
    sessionStorage.clear();
    const events = this.injector.get(Events);
    events.publish('user:logout');
    return Observable.throw("");
  }

  private onTokenRefreshed(response) {
    if (response.accessToken) {
        localStorage.setItem('currentToken', response.accessToken);
    }
  }

  private setToken(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + localStorage.getItem('currentToken') }});
  }
}
