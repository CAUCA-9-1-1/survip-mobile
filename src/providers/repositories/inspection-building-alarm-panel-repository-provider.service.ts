import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {InspectionBuildingFireProtectionForList} from '../../models/inspection-building-fire-protection-for-list';
import {map} from 'rxjs/operators';
import {InspectionBuildingAlarmPanel} from '../../models/inspection-building-alarm-panel';

@Injectable()
export class InspectionBuildingAlarmPanelRepositoryProvider {

    constructor(public http: HttpService) {
    }

    getList(idBuilding: string): Promise<InspectionBuildingFireProtectionForList[]> {
        return this.http.get('inspection/building/' + idBuilding + '/alarmpanel')
            .pipe(map(response => response))
            .toPromise();
    }

    get(idBuildingAlarmPanel: string): Promise<InspectionBuildingAlarmPanel> {
        return this.http.get('inspection/building/alarmpanel/' + idBuildingAlarmPanel)
            .pipe(map(response => response))
            .toPromise();
    }

    save(panel: InspectionBuildingAlarmPanel): Promise<any> {
        return this.http.post('inspection/building/alarmpanel/', JSON.stringify(panel))
            .pipe(map(response => response))
            .toPromise();
    }

    delete(idBuildingAlarmPanel: string): Promise<any> {
        return this.http.delete('inspection/building/alarmpanel/' + idBuildingAlarmPanel)
            .pipe(map(response => response))
            .toPromise();
    }
}
