import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError} from 'rxjs/operators';
import 'rxjs/Rx';
import {TranslateService} from "@ngx-translate/core";
import {Events} from 'ionic-angular';
import config from '../../assets/config/config.json';

@Injectable()
export class HttpService {
    private readonly apiUrl: string = 'http://localhost/';

    constructor(
        private client: HttpClient,
        private translateService: TranslateService,
        private events: Events
    ) {
        if (config.apiUrl !== 'YOUR_URL_API') {
            this.apiUrl = config.apiUrl;
        }
    }

    private getHeaders() {
      return {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('currentToken'),
            'Language-Code': this.translateService.getDefaultLang() || 'fr'
          })
        };
    }

    public get(url: string, displayError: boolean = true): Observable<any> {
        return this.client.get(this.getFullUrl(url), this.getHeaders())
          .pipe(
            catchError((error: HttpErrorResponse) => this.onError(error, displayError))
        );
    }

    public rawGet(url: string, retryCount: number = 3, displayError: boolean = true): Observable<any> {
        return this.client.get(this.getFullUrl(url), this.getHeaders());
    }

    public post(url: string, body?: any, displayError: boolean = true): Observable<any> {
        return this.client.post(this.getFullUrl(url), body, this.getHeaders()).pipe(
            catchError((error: HttpErrorResponse) => this.onError(error, displayError))
        );
    }

    public rawPost(url: string, body?: any, displayError: boolean = true): Observable<any> {
        return this.client.post(this.getFullUrl(url), body, this.getHeaders()).pipe(
            catchError((err: HttpErrorResponse) => this.onError(err, displayError))
        );
    }

    public put(url: string, body?: any, displayError: boolean = true): Observable<any> {
        return this.client.put(this.getFullUrl(url), body, this.getHeaders()).pipe(
            catchError((error: HttpErrorResponse) => this.onError(error, displayError))
        );
    }

    public delete(url: string, displayError: boolean = true): Observable<any> {
        return this.client.delete(this.getFullUrl(url), this.getHeaders()).pipe(
            catchError((error: HttpErrorResponse) => this.onError(error, displayError))
        );
    }

    private getFullUrl(url: string): string {
        if (!this.apiUrl) {
            throw new Error('You need to set "apiUrl" inside your "cause" configuration.');
        }
        return this.apiUrl + url;
    }

    private onError(error: HttpErrorResponse, displayError: boolean) {
        let message = '';

        switch (error.status) {
            case 0:
                message = this.translateService.instant('requestTimeout');
                break;
            case 400:
                message = this.translateService.instant(error.error);
                break;
            case 401:
                console.log("401 in http.service.");
                break;
            case 404:
                message = this.translateService.instant('requestServer404', {url: error.url});
                break;
            case 500:
                message = this.translateService.instant('requestServer500');
                break;
        }

        if (message) {
          if (displayError) {
            this.events.publish("http:error", this.translateService.instant('requestErrorDefault'));
          }
          console.log(message);
        }

        return Observable.throw(error);
    }
}


