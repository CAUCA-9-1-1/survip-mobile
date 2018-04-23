import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {InterventionFormFireHydrantForList} from '../../models/intervention-form-fire-hydrant-for-list';

@Injectable()
export class InterventionFormFireHydrantRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idInterventionForm : string): Observable<InterventionFormFireHydrantForList[]>{
    return this.http.get('interventionformfirehydrant/' + idInterventionForm)
      .pipe(map(response => response));
  }
}
