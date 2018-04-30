import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Loading, LoadingController} from 'ionic-angular';

@Injectable()
export class HttpService {
  private apiUrl = 'http://10.10.33.101:5555/api/';

  constructor(
    //config: ConfigService,
    private client: HttpClient,
  ) {
    //this.apiUrl = config.getConfig('apiUrl');
    console.log(this.apiUrl);
    console.log('chu icitte');
  }

  private getHeaders(){
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('currentToken'),
        'languageCode': 'fr'
      })
    };
    return options;
  }

  public get(url: string, retryCount: number = 3): Observable<any> {
    return this.client.get(this.getFullUrl(url),  this.getHeaders() )
      .retry(retryCount)
      .catch((err: HttpErrorResponse) => this.handleError(err));
  }

  public post(url: string, body?: any): Observable<any> {
    console.log('post', this.getFullUrl(url));
    return this.client
      .post(this.getFullUrl(url), body, this.getHeaders() )
        .retry(3)
        .catch((err: HttpErrorResponse) => this.handleError(err));
  }

  public put(url: string, body?: any): Observable<any> {
    console.log('post', this.getFullUrl(url));
    return this.client.post(this.getFullUrl(url), body, this.getHeaders() )
      .retry(3)
      .catch((err: HttpErrorResponse) => this.handleError(err));
  }

  public delete(url: string): Observable<any> {
    return this.client.delete(this.getFullUrl(url), this.getHeaders() )
      .retry(3)
      .catch((err: HttpErrorResponse) => this.handleError(err));
  }

  private getFullUrl(url: string): string {
    if (!this.apiUrl) {
      throw new Error('You need to set "apiUrl" inside your "cause" configuration.');
    }
    return this.apiUrl + url;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      if (error.status == 0 || error.status == 401)
        console.log("shall redirect");
    }
    return Observable.of({
      'status': error.status,
      'body': error.error
    });
  }
}


