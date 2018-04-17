import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

import {RequestLoader} from './request-loader.model';
import {Loading, LoadingController} from 'ionic-angular';

@Injectable()
export class RequestLoaderService {
  private loader: Loading;

  constructor(private loadingCtrl: LoadingController) {
    this.loader = this.loadingCtrl.create({ content: 'Please wait...'});
  }

  show() {
    this.loader.present();
  }

  hide() {
    this.loader.dismiss();
  }
}
