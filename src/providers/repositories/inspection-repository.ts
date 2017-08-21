import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import {Inspection} from '../../interfaces/inspection.interface';
import {HttpService} from '../Base/http.service';

@Injectable()
export class InspectionRepositoryProvider{

  constructor(public http: HttpService) {}

  getAll(): Observable<Inspection[]> {
    return this.http.get('inspection').map((response: Response) => {
      const result = response.json();
      return result.data;
    });
  }

  get(id: string): Observable<Inspection> {
    return this.http.get('api/inspection/' + id).map((response: Response) => {
      const result = response.json();
      return result.data as Inspection;
    });
  }
}
