import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpService} from '../Base/http.service';
import {UnitOfMeasure} from '../../models/all-construction-types';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UnitOfMeasureRepositoryProvider {

  private readonly baseUrl: string = "unitofmeasure/";

  constructor(public http: HttpService) {
  }

  getAllForRate(): Observable<UnitOfMeasure[]> {
    return this.getAllForType('rate');
  }

  getAllForDiameter(): Observable<UnitOfMeasure[]> {
    return this.getAllForType('diameter');
  }

  getAllForPressure(): Observable<UnitOfMeasure[]> {
    return this.getAllForType('pressure');
  }

  getAllForCapacity(): Observable<UnitOfMeasure[]> {
    return this.getAllForType('rate');
  }

  getAllForDimension(): Observable<UnitOfMeasure[]> {
    return this.getAllForType('dimension');
  }

  getAllForType(name: string): Observable<UnitOfMeasure[]> {
    return this.http.get(this.baseUrl + name)
      .pipe(map(response => response));
  }
}
