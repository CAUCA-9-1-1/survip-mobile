import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

@Injectable()
export class OperatorTypeRepositoryProvider {

    constructor(private http: HttpService) {
    }

    public getOperatorType(): Observable<any> {
        return this.http.get('OperatorType')
            .pipe(map(response => response));
    }
}