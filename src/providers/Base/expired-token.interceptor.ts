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

    console.log('intercepted request!');

    const authRequest = req.clone();

    return next.handle(this.setToken(authRequest))
      .catch(error => {
        //return Observable.throw(error);
        console.log("Error occured", error);

        if (error instanceof HttpErrorResponse && authRequest.url.indexOf('Authentification/') < 0 && (<HttpErrorResponse>error).status == 401) {
          console.log("401 in interceptor!!!");
          return this.refreshToken(authRequest, next);
        } else {
          console.log("Authentification error not catched", error);
          return Observable.throw(error);
        }

      });
  }

  private refreshToken(req: HttpRequest<any>, next: HttpHandler) {

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      const authService = this.injector.get(AuthenticationService);

      return authService.refreshToken()
        .switchMap((response) => {
          console.log("Token refreshed???");
          this.onRefresh(response);
          if (sessionStorage.getItem("currentToken")){
            this.tokenSubject.next(sessionStorage.getItem("currentToken"));
            this.isRefreshingToken = false;
            return next.handle(this.setToken(req));
          }

          // If we don't get a new token, we are in trouble so logout.
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

  private onRefresh(response) {
    if (response.accessToken) {
      sessionStorage.setItem('currentToken', response.accessToken);
    }
  }

  private setToken(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + sessionStorage.getItem('currentToken') }});
  }
}
