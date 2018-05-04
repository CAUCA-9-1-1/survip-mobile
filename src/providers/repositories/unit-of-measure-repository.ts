import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpService} from '../Base/http.service';
import {UnitOfMeasure} from '../../models/all-construction-types';

@Injectable()
export class UnitOfMeasureRepositoryProvider {

  private readonly baseUrl: string = "unitofmeasure/";

  constructor(public http: HttpService) {
  }

  getAllForRate(): Promise<UnitOfMeasure[]> {
    return this.getAllForType('rate');
  }

  getAllForDiameter(): Promise<UnitOfMeasure[]> {
    return this.getAllForType('diameter');
  }

  getAllForPressure(): Promise<UnitOfMeasure[]> {
    return this.getAllForType('pressure');
  }

  getAllForcapacity(): Promise<UnitOfMeasure[]> {
    return this.getAllForType('rate');
  }

  getAllForDimension(): Promise<UnitOfMeasure[]> {
    return this.getAllForType('dimension');
  }

  getAllForType(name: string): Promise<UnitOfMeasure[]> {
    return this.http.get(this.baseUrl + name)
      .pipe(map(response => response))
      .toPromise();
  }
}
