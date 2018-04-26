import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {CityFireHydrantForList} from '../../models/city-fire-hydrant-for-list';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

@Injectable()
export class BuildingFireHydrantRepositoryProvider {

    constructor(private http: HttpService) {}

    public getList(idCity : string): Observable<CityFireHydrantForList[]>{
        return this.http.get('buildingformfirehydrant/' + idCity)
            .pipe(map(response => response));
    }


}