import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {InspectionBuildingAnomaly} from '../../models/inspection-building-anomaly';
import {map} from 'rxjs/operators';
import {InspectionBuildingAnomalyThemeForList} from '../../models/inspection-building-anomaly-theme-for-list';

@Injectable()
export class InspectionBuildingAnomalyRepositoryProvider {

  constructor(public http: HttpService) {
  }

  public getList(idBuilding: string): Promise<InspectionBuildingAnomalyThemeForList[]> {
    return this.http.get('inspection/building/' + idBuilding + '/anomaly')
      .pipe(map(response => response))
      .toPromise();
  }

  public getThemes(): Promise<string[]> {
    return this.http.get('inspection/anomalythemes')
      .pipe(map(response => response))
      .toPromise();
  }

  public get(idBuildingAnomaly: string): Promise<InspectionBuildingAnomaly> {
    return this.http.get('inspection/building/anomaly/' + idBuildingAnomaly)
      .pipe(map(response => response))
      .toPromise();
  }

  public save(anomaly: InspectionBuildingAnomaly): Promise<any> {
    return this.http.post('inspection/building/anomaly/', JSON.stringify(anomaly))
      .pipe(map(response => response))
      .toPromise();
  }

  public delete(idBuildingAnomaly: string): Promise<any> {
    return this.http.delete('inspection/building/anomaly/' + idBuildingAnomaly)
      .pipe(map(response => response))
      .toPromise();
  }
}

