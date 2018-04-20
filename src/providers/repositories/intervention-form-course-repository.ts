import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {InterventionFormCourseForList} from '../../models/intervention-form-course-for-list';
import {Observable} from 'rxjs/Observable';
import {InterventionFormCourse} from '../../models/intervention-form-course';
import {CourseLanes} from '../../models/course_lanes';
import {map} from 'rxjs/operators';

@Injectable()
export class InterventionFormCourseRepositoryProvider {

  constructor(private http: HttpService) {}

  public getList(idInterventionForm : string): Observable<InterventionFormCourseForList[]>{
   return this.http.get('interventionplancourseforlist/' + idInterventionForm)
     .pipe(map(response => response));
  }

  public get(idInterventionFormCourse: string) : Observable<CourseLanes> {
    return this.http.get('interventionplancourse/' + idInterventionFormCourse)
      .pipe(map(response => response));
  }

  public save(course: InterventionFormCourse): Observable<any> {
    if (course.id == null)
      return this.add(course);
    else
      return this.update(course);
  }

  private add(course: InterventionFormCourse) : Observable<any> {
    return this.http.post('interventionplancourse', JSON.stringify(course))
      .pipe(map(response => response));
  }

  private update(course: InterventionFormCourse) : Observable<any> {
    return this.http.put('interventionplancourse', JSON.stringify(course))
      .pipe(map(response => response));
  }

  public delete(course: InterventionFormCourse) : Observable<any> {
    if (course.id ==  null)
      return Observable.of('');
    else {
      return this.http.delete('interventionplancourse/' + course.id)
        .pipe(map(response => response));
    }
  }
}
