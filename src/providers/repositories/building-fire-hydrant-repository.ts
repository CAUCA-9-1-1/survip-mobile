import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {CityFireHydrantForList} from '../../models/city-fire-hydrant-for-list';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

@Injectable()
export class BuildingFireHydrantRepositoryProvider {

    constructor(private http: HttpService) {
    }

    deleteBuildingFireHydrant(idBuildingFireHydrant: string): Observable<any> {
        if (idBuildingFireHydrant == null)
            return Observable.of('');
        else {
            return this.http.delete('inspection/buildingFireHydrant/' + idBuildingFireHydrant)
                .pipe(map(response => response));
        }
    }

    addBuildingFireHydrant(idBuilding: string, idFireHydrant: string): Observable<any> {
        if ((!idBuilding) || (!idFireHydrant))
            return Observable.of('');
        else {
            return this.http.post('inspection/building/' + idBuilding + '/fireHydrant/' + idFireHydrant)
                .pipe(map(response => response));
        }
    }

    getList(idCity: string): Observable<CityFireHydrantForList[]> {
        return this.http.get('FireHydrant/city/' + idCity)
            .pipe(map(response => response));
    }

    getCityFireHydrantListForBuilding(idCity: string, idBuilding: string): Observable<CityFireHydrantForList[]> {
        return this.http.get('FireHydrant/city/' + idCity + '/building/' + idBuilding)
            .pipe(map(response => response));
    }
}