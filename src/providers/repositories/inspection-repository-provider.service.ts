import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import {Inspection} from '../../interfaces/inspection.interface';
import {HttpService} from '../Base/http.service';
import {map} from 'rxjs/operators';
import {Batch} from '../../models/batch';

@Injectable()
export class InspectionRepositoryProvider{

  constructor(public http: HttpService) {}

  getAll(): Observable<Batch[]> {
    return this.http.get('inspection')
      .pipe(map(response => response));
  }

  get(id: string): Observable<Inspection> {
    return this.http.get('api/inspection/' + id)
      .pipe(map(response => response));
  }
}
