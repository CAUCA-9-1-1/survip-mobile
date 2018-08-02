import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
import {CourseLanes} from '../../models/course_lanes';
import {map} from 'rxjs/operators';
import {InspectionBuildingCourseForList} from '../../models/inspection-building-course-for-list';
import {InspectionBuildingCourse} from '../../models/inspection-building-course';

@Injectable()
export class InspectionBuildingCourseRepositoryProvider {

    constructor(private http: HttpService) {
    }

    getList(idInspection: string): Observable<InspectionBuildingCourseForList[]> {
        return this.http.get('inspection/' + idInspection + '/course')
            .pipe(map(response => response));
    }

    get(idInspectionBuildingCourse: string): Observable<CourseLanes> {
        return this.http.get('inspection/course/' + idInspectionBuildingCourse)
            .pipe(map(response => response));
    }

    save(course: InspectionBuildingCourse): Observable<any> {
        return this.http.post('inspection/course', JSON.stringify(course))
            .pipe(map(response => response));
    }

    delete(course: InspectionBuildingCourse): Observable<any> {
        if (course.id == null)
            return Observable.of('');
        else {
            return this.http.delete('inspection/course/' + course.id)
                .pipe(map(response => response));
        }
    }
}
