import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {InterventionFormCourseLane} from '../../models/intervention-form-course-lane';
import {Observable} from 'rxjs/Observable';
import {InterventionFormCourseLaneForList} from '../../models/intervention-form-course-lane-for-list';
import {map} from 'rxjs/operators';

@Injectable()
export class InterventionFormCourseLaneRepositoryProvider {
  constructor(private http: HttpService){}

  public get(idInterventionPlanCourseLane: string) : Observable<InterventionFormCourseLane> {
    return this.http.get('interventionplancourselane/' + idInterventionPlanCourseLane)
      .pipe(map(response => response));
  }

  public save(courseLane: InterventionFormCourseLane): Observable<any> {
    if (courseLane.id == null)
      return this.add(courseLane);
    else
      return this.update(courseLane);
  }

  private add(courseLane: InterventionFormCourseLane) : Observable<any> {
    return this.http.post('interventionplancourselane', JSON.stringify(courseLane))
      .pipe(map(response => response));
  }

  private update(courseLane: InterventionFormCourseLane) : Observable<any> {
    return this.http.put('interventionplancourselane', JSON.stringify(courseLane))
      .pipe(map(response => response));
  }

  public delete(courseLane: InterventionFormCourseLane) : Observable<any> {
    return this.http.delete('interventionplancourselane/' + courseLane.id)
      .pipe(map(response => response));
  }

  public saveCourseLane(course: InterventionFormCourseLaneForList) : Observable<any> {
    return this.http.put('interventionplancourselane', JSON.stringify(course))
      .pipe(map(response => response));
  }
}
