import {Injectable} from '@angular/core';
import {InspectionBuildingContactForList} from '../../models/inspection-building-contact-for-list';
import {map} from 'rxjs/operators';
import {InspectionBuildingContact} from '../../models/inspection-building-contact';
import {HttpService} from '../Base/http.service';

@Injectable()
export class BuildingContactRepositoryProvider {

    constructor(public http: HttpService) {
    }

    getList(idBuilding: string): Promise<InspectionBuildingContactForList[]> {
        return this.http.get('inspection/building/' + idBuilding + '/contact')
            .pipe(map(response => response))
            .toPromise();
    }

    get(idBuildingContact: string): Promise<InspectionBuildingContact> {
        return this.http.get('inspection/building/contact/' + idBuildingContact)
            .pipe(map(response => response))
            .toPromise();
    }

    save(contact: InspectionBuildingContact): Promise<any> {
        return this.http.post('inspection/building/contact/', JSON.stringify(contact))
            .pipe(map(response => response))
            .toPromise();
    }

    delete(idBuildingContact: string): Promise<any> {
        return this.http.delete('inspection/building/contact/' + idBuildingContact)
            .pipe(map(response => response))
            .toPromise();
    }
}
