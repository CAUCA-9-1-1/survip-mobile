import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {GenericType} from '../../models/generic-type';
import {map} from 'rxjs/operators';

@Injectable()
export class SprinklerTypeRepository {

    constructor(public http: HttpService) {
    }

    getAll(): Observable<GenericType[]> {
        return this.http.get('sprinklertype')
            .pipe(map(response => response));
    }
}
