import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Response} from '@angular/http';
import {InterventionPlanCourseForlist} from '../../models/intervention-plan-course-forlist';
import {Observable} from 'rxjs/Observable';
import {InterventionPlanCourse} from '../../models/intervention-plan-course';
import {CourseLanes} from '../../models/course_lanes';
import {InterventionPlanCourseLaneForlist} from '../../models/intervention-plan-course-lane-forlist';

@Injectable()
export class InterventionPlanCourseRepositoryProvider {

  constructor(private http: HttpService) {}

  public getList(idInterventionPlan : string): Observable<InterventionPlanCourseForlist[]>{
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

  public save(course: InterventionPlanCourse): Observable<any> {
    if (course.idInterventionPlanCourse == null)
      return this.add(course);
    else
      return this.update(course);
  }

  private add(course: InterventionPlanCourse) : Observable<any> {
    return this.http.post('interventionplancourse', JSON.stringify(course)).map((response: Response) => {
      const result = response.json();
      course.idInterventionPlanCourse = result.idInterventionPlanCourse;
    });
  }

  private update(course: InterventionPlanCourse) : Observable<any> {
    return this.http.put('interventionplancourse', JSON.stringify(course)).map((response: Response) => {
      const result = response.json();
    });
  }

  public delete(course: InterventionPlanCourse) : Observable<any> {
    if (course.idInterventionPlanCourse ==  null)
      return Observable.of('');
    else {
      return this.http.delete('interventionplancourse/' + course.idInterventionPlanCourse).map((response: Response) => {
        const result = response.json();
      });
    }
  }
}
