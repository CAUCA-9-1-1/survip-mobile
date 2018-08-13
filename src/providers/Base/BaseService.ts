import {NavController} from 'ionic-angular';
import {Headers, RequestOptions} from '@angular/http';
export class BaseService {
  protected host = './assets/data/';
  private router: NavController;

  constructor() {
  }

  protected authorization() {
    const token = sessionStorage.getItem('currentToken');

    if (token) {
      return new RequestOptions({
        headers: new Headers({
          'Authorization': token
        })
      });
    }
  }

  protected isLogin(result, returnUrl) {
    if (result.error) {
      console.log(result.error);
    }

    if (result.login === false) {
      console.log('Login : todo.')
      /*this.router.push(['/login'], {
        queryParams: {
          returnUrl: returnUrl
        }
      });*/
    }
  }

  protected handleError(error: Response | any) {
    let errMsg: string;

    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body['error'] || JSON.stringify(body);

      // errMsg = ${error.status} + ' - ' + ${error.statusText || ''} + ' ' + ${err};
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    console.error(error);
    return Promise.reject(errMsg);
  }
}
