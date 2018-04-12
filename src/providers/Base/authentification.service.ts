import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpService} from './http.service';

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpService) { }

  public login(username: string, password: string) {
    return this.http.post('Authentification/Logon?user=' + username + '&password=' + password, {
      username: username,
      password: password,
    }).pipe(
      map(response => this.onResponse(response))
    );
  }

  public logout() {
    localStorage.removeItem('currentToken');
  }

  private onResponse(result) {
    console.log(result);
    if (result.data.accessToken) {
      localStorage.setItem('currentToken', result.data.accessToken);
    }
    return result.data;
  }
}
