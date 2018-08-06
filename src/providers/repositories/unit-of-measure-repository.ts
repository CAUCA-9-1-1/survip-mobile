import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpService} from '../Base/http.service';
import {UnitOfMeasure} from '../../models/all-construction-types';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UnitOfMeasureRepositoryProvider {

    private readonly baseUrl: string = "unitofmeasure/";

    constructor(public http: HttpService) {
    }

    public  getAllForRate(): Observable<UnitOfMeasure[]> {
        return this.getAllForType('rate');
    }

    public getAllForDiameter(): Observable<UnitOfMeasure[]> {
        return this.getAllForType('diameter');
    }

    public getAllForPressure(): Observable<UnitOfMeasure[]> {
        return this.getAllForType('pressure');
    }

    public getAllForCapacity(): Observable<UnitOfMeasure[]> {
        return this.getAllForType('capacity');
    }

    public getAllForDimension(): Observable<UnitOfMeasure[]> {
        return this.getAllForType('dimension');
    }

    private getAllForType(name: string): Observable<UnitOfMeasure[]> {
        return this.http.get(this.baseUrl + name)
            .pipe(map(response => response));
    }
}
