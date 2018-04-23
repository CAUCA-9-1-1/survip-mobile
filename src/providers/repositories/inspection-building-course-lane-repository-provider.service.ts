import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators';
import {InspectionBuildingCourseLane} from '../../models/inspection-building-course-lane';
import {InspectionBuildingCourseLaneForList} from '../../models/inspection-building-course-lane-for-list';

@Injectable()
export class InspectionBuildingCourseLaneRepositoryProvider {
  constructor(private http: HttpService){}

  public get(idInspectionCourse: string) : Observable<InspectionBuildingCourseLane> {
    return this.http.get('inspection/' + idInspectionCourse + '/courselane/')
      .pipe(map(response => response));
  }

  public save(courseLane: InspectionBuildingCourseLane): Observable<any> {
    if (courseLane.id == null)
      return this.add(courseLane);
    else
      return this.update(courseLane);
  }

  private add(courseLane: InspectionBuildingCourseLane) : Observable<any> {
    return this.http.post('interventionplancourselane', JSON.stringify(courseLane))
      .pipe(map(response => response));
  }

  private update(courseLane: InspectionBuildingCourseLane) : Observable<any> {
    return this.http.put('interventionplancourselane', JSON.stringify(courseLane))
      .pipe(map(response => response));
  }

  public delete(courseLane: InspectionBuildingCourseLane) : Observable<any> {
    return this.http.delete('interventionplancourselane/' + courseLane.id)
      .pipe(map(response => response));
  }

  public saveCourseLane(course: InspectionBuildingCourseLaneForList) : Observable<any> {
    return this.http.put('interventionplancourselane', JSON.stringify(course))
      .pipe(map(response => response));
  }
}
