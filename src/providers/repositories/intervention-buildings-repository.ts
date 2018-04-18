import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {InterventionFormBuildingForList} from '../../models/intervention-form-building-for-list';
import {map} from 'rxjs/operators';

@Injectable()
export class InterventionBuildingsRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idIntervention : string): Observable<InterventionFormBuildingForList[]>{
    return this.http.get('interventionplanbuildings/' + idIntervention)
      .pipe(map(response => response));
  }
}
