import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {FireHydrant} from "../../models/fire-hydrant";
import {GenericType} from "../../models/generic-type";

@Injectable()
export class FireHydrantRepositoryProvider {

    constructor(private http: HttpService) {
    }

    public deleteFireHydrant(idFireHydrant: string): Observable<any> {
        return this.http.delete('fireHydrant/' + idFireHydrant)
            .pipe(map(response => response));
    }

    public saveFireHydrant(fireHydrant: FireHydrant): Observable<any> {
        if (fireHydrant) {
            return this.http.post('FireHydrant/', fireHydrant)
                .pipe(map(response => response));
        }
    }

    public getFireHydrantType():Observable<GenericType>{
        return this.http.get('FireHydrantType/localized')
            .pipe(map(response => response));
    }

    public colors = [{
        id: '#000000',
        color: '#000000',
    }, {
        id: '#FFFFFF',
        color: '#FFFFFF',
    }, {
        id: '#6495ED',
        color: '#6495ED',
    }, {
        id: '#9ACD32',
        color: '#9ACD32',
    }, {
        id: '#FFA500',
        color: '#FFA500',
    }, {
        id: '#FF0000',
        color: '#FF0000',
    }, {
        id: '#FFFF00',
        color: '#FFFF00',
    }, {
        id: '#CB42F4',
        color: '#CB42F4',
    }];
}