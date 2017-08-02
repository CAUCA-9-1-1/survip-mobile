import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {RequestLoader} from './request-loader.model';

@Injectable()
export class RequestLoaderService {
  private loaderSubject = new Subject<RequestLoader>();
  public loaderState: Observable<RequestLoader> = this.loaderSubject.asObservable();

  constructor() { }

  show() {
    this.loaderSubject.next(<RequestLoader>{show: true});
  }

  hide() {
    this.loaderSubject.next(<RequestLoader>{show: false});
  }
}
