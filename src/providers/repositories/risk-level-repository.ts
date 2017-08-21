import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RiskLevelRepositoryProvider {

  constructor(public http: HttpService){}

  getAll() {
    return this.http.get('risklevellist').map((response: Response) => {
      const result = response.json();;
      return result.data;
    });
  }

  getById(idRiskLevel: string) {
    if (idRiskLevel == null)
      return Observable.of('')
    else
      return this.http.get('risklevellist/' + idRiskLevel).map((response: Response) => {
        const result = response.json();
        if (result.data.length > 0) {
          return result.data[0];
        } else {
          return null;
        }
      });
  }
}
