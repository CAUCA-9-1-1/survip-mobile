import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {HazardousMaterialForList} from '../../models/hazardous-material-for-list';
import {map} from 'rxjs/operators';

@Injectable()
export class HazardousMaterialRepositoryProvider {

    constructor(public http: HttpService) {
    }

    public getFiltered(searchTerm: string): Observable<HazardousMaterialForList[]> {
        return this.http.get("hazardousmaterial/search/" + searchTerm)
    }

    public getSelectedMaterial(idHazardousMaterial: string): Promise<HazardousMaterialForList> {
        return this.http.get("hazardousMaterial/" + idHazardousMaterial + "/name")
            .pipe(map(response => response))
            .toPromise();
    }
}
