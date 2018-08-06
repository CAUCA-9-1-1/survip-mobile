import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {InspectionBuildingFireProtectionForList} from '../../models/inspection-building-fire-protection-for-list';
import {map} from 'rxjs/operators';
import {InspectionBuildingSprinkler} from '../../models/inspection-building-sprinkler';

@Injectable()
export class InspectionBuildingSprinklerRepositoryProvider {

    constructor(public http: HttpService) {
    }

    public getList(idBuilding: string): Promise<InspectionBuildingFireProtectionForList[]> {
        return this.http.get('inspection/building/' + idBuilding + '/sprinkler')
            .pipe(map(response => response))
            .toPromise();
    }

    public get(idBuildingSprinkler: string): Promise<InspectionBuildingSprinkler> {
        return this.http.get('inspection/building/sprinkler/' + idBuildingSprinkler)
            .pipe(map(response => response))
            .toPromise();
    }

    public save(sprinkler: InspectionBuildingSprinkler): Promise<any> {
        return this.http.post('inspection/building/sprinkler/', JSON.stringify(sprinkler))
            .pipe(map(response => response))
            .toPromise();
    }

    public delete(idBuildingSprinkler: string): Promise<any> {
        return this.http.delete('inspection/building/sprinkler/' + idBuildingSprinkler)
            .pipe(map(response => response))
            .toPromise();
    }
}


