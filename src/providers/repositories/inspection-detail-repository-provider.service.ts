import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {InspectionDetail} from '../../models/inspection-detail';

@Injectable()
export class InspectionDetailRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idInspection : string): Observable<InspectionDetail>{
    return this.http.get('inspection/' + idInspection + '/detail')
      .pipe(map(response => response));
  }

  public savePlanLane(idBuilding: string, idTransversal: string): Observable<boolean>{
    return this.http.put('inspection/building/' + idBuilding + '/idLaneIntersection/' + idTransversal)
      .pipe(map(response => response));
  }

  public savePicture(idBuildingDetail: string, idPicture: string): Observable<boolean>{
    return this.http.put('inspection/buildingdetail/' + idBuildingDetail + '/idPicture/' + idPicture)
      .pipe(map(response => response));
  }
}
