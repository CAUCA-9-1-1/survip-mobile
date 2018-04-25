import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {BuildingFormFireHydrantForList} from '../../models/building-form-fire-hydrant-for-list';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';

@Injectable()
export class BuildingFireHydrantRepositoryProvider {

    constructor(private http: HttpService) {}

    public getList(idBuildingForm : string): Observable<BuildingFormFireHydrantForList[]>{
        return this.http.get('buildingformfirehydrant/' + idBuildingForm)
            .pipe(map(response => response));
    }


}