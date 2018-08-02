import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {map} from 'rxjs/operators';
import {AllConstructionTypes} from '../../models/all-construction-types';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ConstructionTypesRepositoryProvider {

    constructor(public http: HttpService) {
    }

    getAllTypes(): Observable<AllConstructionTypes> {
        return this.http.get('construction/all')
            .pipe(map(response => response));
    }
}
