import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {InterventionPlan} from '../../models/intervention-plan';

@Injectable()
export class InterventionDetailRepositoryProvider{
  constructor(private http: HttpService) {}

  public get(idIntervention : string): Observable<InterventionPlan>{
    return this.http.get('interventionplangeneralinformations/fr/' + idIntervention).map((response : Response) => {
      const result = response.json();
      return result.data;
    });
  }

  public saveTraversalLane(idInterventionPlan: string, idTransversalLane: string): Observable<boolean>{
    return this.http.put('interventionplangeneralinformations/' + idInterventionPlan + '/id_lane_transversal/' + idTransversalLane)
      .map((response: Response) => response.ok);
  }
}