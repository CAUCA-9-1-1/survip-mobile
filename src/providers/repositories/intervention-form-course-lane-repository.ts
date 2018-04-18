import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Response} from '@angular/http';
import {InterventionFormCourseLane} from '../../models/intervention-form-course-lane';
import {Observable} from 'rxjs/Observable';
import {InterventionFormCourseLaneForList} from '../../models/intervention-form-course-lane-for-list';

@Injectable()
export class InterventionFormCourseLaneRepositoryProvider {
  constructor(private http: HttpService){}

  public get(idInterventionPlanCourseLane: string) : Observable<InterventionFormCourseLane> {
    return this.http.get('interventionplancourselane/' + idInterventionPlanCourseLane).map((response: Response) => {
      const result = response.json();
      return result.data;
    });
  }

  public save(courseLane: InterventionFormCourseLane): Observable<any> {
    if (courseLane.id == null)
      return this.add(courseLane);
    else
      return this.update(courseLane);
  }

  private add(courseLane: InterventionFormCourseLane) : Observable<any> {
    return this.http.post('interventionplancourselane', JSON.stringify(courseLane)).map((response: Response) => {
      const result = response.json();
      courseLane.id = result.idInterventionPlanCourseLane;
    });
  }

  private update(courseLane: InterventionFormCourseLane) : Observable<any> {
    return this.http.put('interventionplancourselane', JSON.stringify(courseLane)).map((response: Response) => {
      const result = response.json();
    });
  }

  public delete(courseLane: InterventionFormCourseLane) : Observable<any> {
    return this.http.delete('interventionplancourselane/' + courseLane.id).map((response: Response) => {
      const result = response.json();
    });
  }

  public saveCourseLane(course: InterventionFormCourseLaneForList) : Observable<any> {
    return this.http.put('interventionplancourselane', JSON.stringify(course)).map((response: Response) => {
      const result = response.json();
    });
  }
}
