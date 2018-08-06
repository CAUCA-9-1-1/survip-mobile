import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {GenericType} from '../../models/generic-type';
import {map} from 'rxjs/operators';

@Injectable()
export class AlarmPanelTypeRepository {

    constructor(public http: HttpService) {
    }

    public getAll(): Observable<GenericType[]> {
        return this.http.get('alarmpaneltype')
            .pipe(map(response => response));
    }
}
