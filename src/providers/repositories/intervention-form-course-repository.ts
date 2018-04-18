import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Response} from '@angular/http';
import {InterventionFormCourseForList} from '../../models/intervention-form-course-for-list';
import {Observable} from 'rxjs/Observable';
import {InterventionFormCourse} from '../../models/intervention-form-course';
import {CourseLanes} from '../../models/course_lanes';

@Injectable()
export class InterventionFormCourseRepositoryProvider {

  constructor(private http: HttpService) {}

  public getList(idInterventionPlan : string): Observable<InterventionFormCourseForList[]>{
   return this.http.get('interventionplancourseforlist/' + idInterventionPlan).map((response: Response) => {
     const result = response.json();
     return result.data;
    });
  }

  public get(idInterventionPlanCourse: string) : Observable<CourseLanes> {
    return this.http.get('interventionplancourse/' + idInterventionPlanCourse).map((response: Response) => {
      const result = response.json();
      return result.data;
    });
  }

  public save(course: InterventionFormCourse): Observable<any> {
    if (course.id == null)
      return this.add(course);
    else
      return this.update(course);
  }

  private add(course: InterventionFormCourse) : Observable<any> {
    return this.http.post('interventionplancourse', JSON.stringify(course)).map((response: Response) => {
      const result = response.json();
      course.id = result.idInterventionPlanCourse;
    });
  }

  private update(course: InterventionFormCourse) : Observable<any> {
    return this.http.put('interventionplancourse', JSON.stringify(course)).map((response: Response) => {
      const result = response.json();
    });
  }

  public delete(course: InterventionFormCourse) : Observable<any> {
    if (course.id ==  null)
      return Observable.of('');
    else {
      return this.http.delete('interventionplancourse/' + course.id).map((response: Response) => {
        const result = response.json();
      });
    }
  }
}
