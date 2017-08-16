import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {RouteDirection} from '../../models/route-direction';

@Injectable()
export class RouteDirectionRepositoryProvider {
  constructor(private http: HttpService) {}

  public getList(): Observable<RouteDirection[]> {
    return this.http.get('routedirection').map((response: Response) => {
      const result = response.json();
      return result.data;
    });
  }
}
