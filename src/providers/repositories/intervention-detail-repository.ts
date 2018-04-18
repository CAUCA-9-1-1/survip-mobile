import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionForm} from '../../models/intervention-form';
import {map} from 'rxjs/operators';

@Injectable()
export class InterventionDetailRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idIntervention : string): Observable<InterventionForm>{
    return this.http.get('interventionplangeneralinformations/fr/' + idIntervention)
      .pipe(map(response => response));
  }

  public savePlanField(idInterventionPlan: string, fieldName: string, value: string): Observable<boolean>{
    return this.http.put('interventionplangeneralinformations/' + idInterventionPlan + '/' + fieldName + '/' + value)
      .pipe(map(response => response));
  }
}
