import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CourseLanes} from '../../models/course_lanes';
import {map} from 'rxjs/operators';
import {InspectionBuildingCourseForList} from '../../models/inspection-building-course-for-list';
import {InspectionBuildingCourse} from '../../models/inspection-building-course';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class InspectionBuildingCourseRepositoryProvider {

  constructor(private storage: OfflineStorage) {
    }

    public  getList(idInspection: string): Observable<InspectionBuildingCourseForList[]> {
        return this.http.get('inspection/' + idInspection + '/course')
            .pipe(map(response => response));
    }

    public get(idInspectionBuildingCourse: string): Observable<CourseLanes> {
        return this.http.get('inspection/course/' + idInspectionBuildingCourse)
            .pipe(map(response => response));
    }

    public save(course: InspectionBuildingCourse): Observable<any> {
        return this.http.post('inspection/course', JSON.stringify(course))
            .pipe(map(response => response));
    }

    public delete(course: InspectionBuildingCourse): Observable<any> {
        if (course.id == null)
            return Observable.of('');
        else {
            return this.http.delete('inspection/course/' + course.id)
                .pipe(map(response => response));
        }
    }
}
