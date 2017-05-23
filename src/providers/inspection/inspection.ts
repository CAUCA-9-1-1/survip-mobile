import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {BaseService} from '../Base/BaseService';
import {Observable} from 'rxjs/Rx';
import {Inspection} from '../../interfaces/inspection.interface';

/*
  Generated class for the InspectionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class InspectionProvider extends BaseService{

  constructor(public http: Http) {
    super();
  }

  getAll(): Observable<Inspection[]> {
    return this.http.get('api/inspection', this.authorization()).map((response: Response) => {
      const result = response.json();

      // this.isLogin(result, '/intervention/maps');
      return result.data;
    });
  }

  get(id: string): Observable<Inspection> {
    return this.http.get('api/inspection/' + id, this.authorization()).map((response: Response) => {
      const result = response.json();

      // this.isLogin(result, '/intervention/maps');
      return result.data as Inspection;
    });
  }
}
