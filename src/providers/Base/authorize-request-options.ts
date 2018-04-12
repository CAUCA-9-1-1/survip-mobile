import { BaseRequestOptions } from '@angular/http';
import {WindowRefService} from './window-ref.service';

export class AuthorizeRequestOptions extends BaseRequestOptions {
  private windowRef = new WindowRefService();
  private storage: any = {};

  constructor (options?: any) {
    super();

    this.storage = this.windowRef.nativeObject('localStorage');
    const token = this.storage.getItem('currentToken');

    this.headers.append('Authorization', 'Bearer ' + token);

    if (options != null) {
      for (const option in options) {
        if (options[option]) {
          this[option] = options[option];
        }
      }
    }
  }
}
