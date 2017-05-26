import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseService} from '../Base/BaseService';

/*
  Generated class for the RiskLevelProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class RiskLevelRepositoryProvider extends BaseService {

  constructor(public http: Http){
    super();
  }

  getAll() {
    return this.http.get('api/risklevel', this.authorization()).map((response: Response) => {
      const result = response.json();

      // this.isLogin(result, '/intervention/maps');
      return result.data;
    });
  }

  getById(idRiskLevel: string) {
    return this.http.get('api/risklevel?idRiskLevel=' + idRiskLevel, this.authorization()).map((response: Response) => {
      const result = response.json();

      // this.isLogin(result, '/intervention/maps');
      if (result.data.length > 0) {
        return result.data[0];
      } else {
        return null;
      }
    });
  }
}
