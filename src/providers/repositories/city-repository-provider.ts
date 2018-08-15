import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {CityWithRegion} from "../../models/city-with-region";

@Injectable()
export class CityRepositoryProvider {

    constructor(private http: HttpService) {
    }

    public getCity(idCity: string): Observable<CityWithRegion> {
        return this.http.get('city/' + idCity+'/localized');
    }
}