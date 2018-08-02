import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {map} from 'rxjs/operators';
import {InspectionBuildingParticularRisk} from '../../models/inspection-building-particular-risk';

@Injectable()
export class InspectionBuildingParticularRiskRepositoryProvider {

    constructor(public http: HttpService) {
    }

    get(riskType: string, idBuilding: string): Promise<InspectionBuildingParticularRisk> {
        return this.http.get('inspection/building/' + idBuilding + '/particularrisk/' + riskType)
            .pipe(map(response => response))
            .toPromise();
    }

    save(riskType: string, risk: InspectionBuildingParticularRisk): Promise<any> {
        return this.http.post('inspection/building/particularrisk/' + riskType, JSON.stringify(risk))
            .pipe(map(response => response))
            .toPromise();
    }

    delete(riskType: string, id: string): Promise<any> {
        return this.http.delete('inspection/building/anomaly/' + riskType + '/' + id)
            .pipe(map(response => response))
            .toPromise();
    }
}
