import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {InspectionBuildingFireHydrantForList} from '../../models/inspection-building-fire-hydrant-for-list';

@Injectable()
export class InspectionBuildingFireHydrantRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idInspection : string): Observable<InspectionBuildingFireHydrantForList[]>{
    return this.http.get('inspection/' + idInspection + '/firehydrant')
      .pipe(map(response => response));
  }
}
