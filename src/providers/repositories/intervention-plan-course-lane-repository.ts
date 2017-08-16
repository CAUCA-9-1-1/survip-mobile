import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Response} from '@angular/http';
import {InterventionPlanCourseLane} from '../../models/intervention-plan-course-lane';
import {Observable} from 'rxjs/Observable';
import {InterventionPlanCourseLaneForlist} from '../../models/intervention-plan-course-lane-forlist';

@Injectable()
export class InterventionPlanCourseLaneRepositoryProvider {
  constructor(private http: HttpService){}

  public get(idInterventionPlanCourseLane: string) : Observable<InterventionPlanCourseLane> {
    return this.http.get('interventionplancourselane/' + idInterventionPlanCourseLane).map((response: Response) => {
      const result = response.json();
      return result.data;
    });
  }

  public save(courseLane: InterventionPlanCourseLane): Observable<any> {
    if (courseLane.idInterventionPlanCourse == null)
      return this.add(courseLane);
    else
      return this.update(courseLane);
  }

  private add(courseLane: InterventionPlanCourseLane) : Observable<any> {
    return this.http.post('interventionplancourselane', JSON.stringify(courseLane)).map((response: Response) => {
      const result = response.json();
      courseLane.idInterventionPlanCourseLane = result.idInterventionPlanCourseLane;
    });
  }

  private update(courseLane: InterventionPlanCourseLane) : Observable<any> {
    return this.http.put('interventionplancourselane', JSON.stringify(courseLane)).map((response: Response) => {
      const result = response.json();
    });
  }

  public delete(courseLane: InterventionPlanCourseLane) : Observable<any> {
    return this.http.delete('interventionplancourselane/' + courseLane.idInterventionPlanCourseLane).map((response: Response) => {
      const result = response.json();
    });
  }

  public saveCourseLane(course: InterventionPlanCourseLaneForlist) : Observable<any> {
    return this.http.put('interventionplancourselane', JSON.stringify(course)).map((response: Response) => {
      const result = response.json();
    });
  }
}
