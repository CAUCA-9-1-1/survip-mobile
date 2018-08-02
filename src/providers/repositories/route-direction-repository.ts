import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {RouteDirection} from '../../models/route-direction';
import {map} from 'rxjs/operators';

@Injectable()
export class RouteDirectionRepositoryProvider {

    constructor(private http: HttpService) {
    }

    getList(): Promise<RouteDirection[]> {
        return this.http.get('routedirection')
            .pipe(map(response => response))
            .toPromise();
    }
}
