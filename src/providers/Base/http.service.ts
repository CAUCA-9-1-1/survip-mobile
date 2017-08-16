import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {
  RequestOptionsArgs,
  Response,
  Headers,
  XHRBackend, Http
} from '@angular/http';

import {AuthService} from './auth.service';
import {AuthorizeRequestOptions} from './authorize-request-options';
import {ConfigService} from './config.service';
import {RequestLoaderService} from './request-loader.service';

@Injectable()
export class HttpService extends AuthService {
  private static count = 0;

  constructor(
    backend: XHRBackend,
    defaultOptions: AuthorizeRequestOptions,
    configService: ConfigService,
    private loaderService: RequestLoaderService,
  ) {
    super(backend, defaultOptions, configService);
  }

  get(url: string, options?: RequestOptionsArgs, isJsonBodyResult: boolean = true): Observable<any> {
    this.showLoader();

    console.log('get', this.getFullUrl(url));

    return super.get(this.getFullUrl(url), this.requestOptions(options))
      //.map(response => (<Response>response).blob())
      .catch(this.onCatch)
      .do((res: Response) => {
        // console.log(url, res);
        this.onSuccess(res, isJsonBodyResult);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      });
  }/*

  getImage(url: string, options?: RequestOptionsArgs, isJsonBodyResult: boolean = true): Observable<Blob> {
    this.showLoader();

    console.log('get', this.getFullUrl(url));

    return this.http.get(this.getFullUrl(url), op)
    return super.get(this.getFullUrl(url), this.requestOptions(options))
      .map(response => (<Response>response).blob())
    .catch(this.onCatch)
     .do((res: Response) => {
     console.log(url, res);
     this.onSuccess(res, isJsonBodyResult);
     }, (error: any) => {
     this.onError(error);
     })
     .finally(() => {
     this.onEnd();
     });
  }

*/
  put(url: string, body?: any, options?: RequestOptionsArgs): Observable<any> {
    this.showLoader();

    return super.put(this.getFullUrl(url), body, this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      });
  }

  post(url: string, body?: any, options?: RequestOptionsArgs): Observable<any> {
    this.showLoader();

    return super.post(this.getFullUrl(url), body, this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      });
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    this.showLoader();
    console.log(url);
    return super.delete(this.getFullUrl(url), this.requestOptions(options))
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .finally(() => {
        this.onEnd();
      });
  }

  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new AuthorizeRequestOptions();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

    return options;
  }

  private getFullUrl(url: string): string {
    if (!this.apiUrl) {
      throw new Error('You need to set "apiUrl" inside your "cause" configuration.');
    }

    return this.apiUrl + url;
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }

  private onSuccess(result: Response, isJsonResult: boolean = true): void {
    console.log(result);
    if (result instanceof Response) {
      if (isJsonResult) { //(result.text().startsWith('{') && result.text().endsWith('}')) {
        const body = result.json() || {};
        this.checkLogin(body);
        this.checkError(body);
      }
    }
  }

  private onError(error: Response | any): void {
    let errorMessage: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body['error'] || JSON.stringify(body);

      errorMessage = error.status + ' - ' + (error.statusText || '') + ' ' + err;
    } else {
      errorMessage = error.message ? error.message : error.toString();
    }

    throw new Error(errorMessage);
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private checkError(body) {
    if (body.success === false) {
      throw new Error(body.error);
    }
  }

  private showLoader(): void {
    HttpService.count++;

    if (HttpService.count) {
      this.loaderService.show();
    }
  }

  private hideLoader(): void {
    HttpService.count--;

    if (!HttpService.count) {
      this.loaderService.hide();
    }
  }
}
