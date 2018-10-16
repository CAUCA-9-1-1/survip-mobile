import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {UtilisationCode} from '../../models/utilisation-code';

@Injectable()
export class UtilisationCodeRepositoryProvider {

    constructor(private http: HttpService) {
    }

    public get(idUtilisationCode: string): Observable<UtilisationCode> {
        if (!idUtilisationCode) {
            return Observable.of(new UtilisationCode());
        } else {
            return this.http.get('utilisationcode/localized/' + idUtilisationCode)
                .pipe(map(response => {
                    return response;
                }));
        }
    }
}
