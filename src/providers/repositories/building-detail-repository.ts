import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {map} from 'rxjs/operators';
import {InspectionBuildingDetail} from '../../models/inspection-building-detail';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BuildingDetailRepositoryProvider {

  constructor(public http: HttpService) {
  }

  public get(idBuilding: string): Observable<InspectionBuildingDetail> {
    return this.http.get('inspection/building/' + idBuilding + "/detail")
      .pipe(map(response => response));
  }

  public save(detail: InspectionBuildingDetail): Observable<any> {
    return this.http.post('inspection/building/detail/', JSON.stringify(detail))
      .pipe(map(response => response));
  }

  public getEnumsKeysCollection(enumCollection: any): number[] {
    return Object.keys(enumCollection)
      .map(k => enumCollection[k])
      .filter(v => typeof v === "number") as number[];
  }
}
