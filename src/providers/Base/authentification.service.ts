import {WindowRefService} from './window-ref.service';
import {Injectable} from '@angular/core';
import {HttpService} from './http.service';

@Injectable()
export class AuthenticationService {
  private storage: any;

  constructor(private http: HttpService,
              //private router: Router,
              private windowRef: WindowRefService) {
    this.storage = this.windowRef.nativeObject('localStorage');
  }

  public login(username: string, password: string) {
    return this.http.login(username, password).map(infoToken => {
      if (infoToken['data'].accessToken) {
        this.storage.setItem('currentToken', infoToken['data'].accessToken);

        return infoToken['data'];
      }

      return {};
    });
  }

  public logout() {
    this.http.logout();
  }
}
