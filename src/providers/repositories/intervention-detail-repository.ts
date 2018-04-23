import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {InterventionPlan} from '../../models/intervention-plan';
import {InterventionForm} from '../../models/intervention-form';
import {map} from 'rxjs/operators';

@Injectable()
export class InterventionDetailRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idInterventionForm : string): Observable<InterventionForm>{
    return this.http.get('interventionform/forweb/' + idInterventionForm)
      .pipe(map(response => response));
  }

  public savePlanLane(idInterventionForm: string, idTransversal: string): Observable<boolean>{
    return this.http.put('interventionform/forweb/' + idInterventionForm + '/idLaneIntersection/' + idTransversal)
      .pipe(map(response => response));
  }

  public savePicture(idInterventionForm: string, idPicture: string): Observable<boolean>{
    return this.http.put('interventionform/forweb/' + idInterventionForm + '/idPicture/' + idPicture)
      .pipe(map(response => response));
  }
}
