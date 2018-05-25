import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionVisit} from "../../models/inspection-visit";

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

    public startInspection(idInspection: string): Observable<any>{
        return this.http.post('inspection/StartInspection', JSON.stringify(idInspection))
            .pipe(map(response => response));
    }

    public updateInspectionVisit(inspectionVisit: InspectionVisit): Observable<InspectionVisit>{
        return this.http.post('inspection/updateVisit', JSON.stringify(inspectionVisit))
            .pipe(map(response => response));
    }

  public InspectionStatusEnum = {'Todo': 0, 'Started': 1, 'WaitingForApprobation': 2, 'Approved': 3, 'Refused': 4, 'Canceled': 5}
  public InspectionVisitStatusEnum = {'Todo': 0, 'Started': 1, 'Completed': 2}
}
