import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {InspectionBuildingForList} from '../../models/inspection-building-for-list';

@Injectable()
export class InspectionBuildingsRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idInspection : string): Observable<InspectionBuildingForList[]>{
    return this.http.get("inspection/" + idInspection + "/building")
      .pipe(map(response => response));
  }
}
