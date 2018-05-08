import { Injectable } from '@angular/core';
import {HttpService} from '../Base/http.service';
import {map} from 'rxjs/operators';
import {InspectionBuildingDetail} from '../../models/inspection-building-detail';

@Injectable()
export class BuildingDetailRepositoryProvider {

  constructor(public http: HttpService) {
  }

  public get(idBuilding: string) : Promise<InspectionBuildingDetail> {
    return this.http.get('inspection/building/' + idBuilding + "/detail")
      .pipe(map(response => response))
      .toPromise();
  }

  public save(detail: InspectionBuildingDetail): Promise<any> {
    return this.http.post('inspection/building/detail/', JSON.stringify(detail))
      .pipe(map(response => response))
      .toPromise();
  }

}
