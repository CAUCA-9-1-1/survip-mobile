import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {FirestationForlist} from '../../models/firestation';
import {map} from 'rxjs/operators';

@Injectable()
export class FirestationRepositoryProvider {
    constructor(private http: HttpService) {
    }

    getList(idCity: string): Promise<FirestationForlist[]> {
        return this.http.get('city/' + idCity + '/firestations')
            .pipe(map(response => response))
            .toPromise();
    }
}
