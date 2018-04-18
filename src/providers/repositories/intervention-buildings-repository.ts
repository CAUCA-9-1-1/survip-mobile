import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {InterventionFormBuildingForList} from '../../models/intervention-plan-building-forlist';

@Injectable()
export class InterventionBuildingsRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idIntervention : string): Observable<InterventionFormBuildingForList[]>{
    return this.http.get('interventionplanbuildings/' + idIntervention).map((response : Response) => {
      const result = response.json();
      return result.data;
    });
  }
}
