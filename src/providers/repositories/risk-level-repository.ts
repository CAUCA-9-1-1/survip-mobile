import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

@Injectable()
export class RiskLevelRepositoryProvider {

  constructor(public http: HttpService){}

  getAll() {
    return this.http.get('risklevel', 3)
      .pipe(
        map(response => {
          console.log(response);
          return response;
        }));
  }

  getById(idRiskLevel: string) {
    if (idRiskLevel == null)
      return Observable.of('');
    else
      return this.http.get('risklevel/' + idRiskLevel, 3)
        .pipe(
          map(response => {
            console.log(response);
            return response;
          }));
  }
}
