import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {map} from 'rxjs/operators';
import {InspectionBuildingPersonRequiringAssistanceForList} from '../../models/inspection-building-person-requiring-assistance-for-list';
import {InspectionBuildingPersonRequiringAssistance} from '../../models/inspection-building-person-requiring-assistance';

@Injectable()
export class InspectionBuildingPersonRequiringAssistanceTypeRepositoryProvider {

    constructor(public http: HttpService) {
    }

    public getList(idBuilding: string): Promise<InspectionBuildingPersonRequiringAssistanceForList[]> {
        return this.http.get('inspection/building/' + idBuilding + '/pnaps')
            .pipe(map(response => response))
            .toPromise();
    }

    public get(idBuildingPnap: string): Promise<InspectionBuildingPersonRequiringAssistance> {
        return this.http.get('inspection/building/pnaps/' + idBuildingPnap)
            .pipe(map(response => response))
            .toPromise();
    }

    public save(pnap: InspectionBuildingPersonRequiringAssistance): Promise<any> {
        return this.http.post('inspection/building/pnaps/', JSON.stringify(pnap))
            .pipe(map(response => response))
            .toPromise();
    }

    public delete(idBuildingPnap: string): Promise<any> {
        return this.http.delete('inspection/building/pnaps/' + idBuildingPnap)
            .pipe(map(response => response))
            .toPromise();
    }
}

