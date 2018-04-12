import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {RequestLoaderService} from './request-loader.service';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable()
export class HttpService {
  private static count = 0;
  private apiUrl = '';

  constructor(
    config: ConfigService,
    private client: HttpClient,
    private loaderService: RequestLoaderService
  ) {
    this.apiUrl = config.getConfig('apiUrl');
    console.log(this.apiUrl);
    console.log('chu icitte');
  }

  get(url: string): Observable<any> {
    this.showLoader();

    console.log('get', this.getFullUrl(url));
    return this.client.get(this.getFullUrl(url), {
        headers: {
          "Authorization": "Bearer " + "asdf"
        }
      }
    )
  }

  post(url: string, body?: any): Observable<any> {
    this.showLoader();
    console.log('post', this.getFullUrl(url));
    return this.client.post(this.getFullUrl(url), body, {
        headers: {
          "Authorization": "Bearer " + "asdf"
        }
      }
    )
  }


  put(url: string, body?: any): Observable<any> {
    this.showLoader();

    console.log('post', this.getFullUrl(url));
    return this.client.post(this.getFullUrl(url), body, {
        headers: {
          "Authorization": "Bearer " + "asdf"
        }
      }
    )
  }

  delete(url: string): Observable<any> {
    this.showLoader();
    return this.client.delete(this.getFullUrl(url), {
        headers: {
          "Authorization": "Bearer " + "asdf"
        }
      }
    )
  }

  private getFullUrl(url: string): string {
    if (!this.apiUrl) {
      throw new Error('You need to set "apiUrl" inside your "cause" configuration.');
    }

    return this.apiUrl + url;
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
