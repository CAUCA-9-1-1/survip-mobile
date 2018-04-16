import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {RiskLevel} from '../../models/risk-level';
import {map} from 'rxjs/operators';

@Injectable()
export class RiskLevelRepositoryProvider {

  constructor(public http: HttpService){}

  getAll() {
    return this.http.get<RiskLevel>('risklevel', 3)
      .pipe(
        map(response => {
          console.log(response);
          return response;
        }));


      /*.map((response: HttpResponse) => {
      const result = response.body.json();
      return result.data;
    });*/
  }

  getById(idRiskLevel: string) {
    if (idRiskLevel == null)
      return Observable.of('');
    else
      return this.http.get<RiskLevel>('risklevel/' + idRiskLevel, 3)
        .pipe(
          map(response => {
            console.log(response);
            return response;
          }));
        /*.map((response: HttpResponse) => {
        if (response.body) {
          return response.body.toJson();
        } else {
          return null;
        }
      });*/
  }
}
