import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {map} from 'rxjs/operators';
import {InspectionBuildingCourseLane} from '../../models/inspection-building-course-lane';

@Injectable()
export class InspectionBuildingCourseLaneRepositoryProvider {
    constructor(private http: HttpService) {
    }

    public getLane(idInspectionCourseLane: string): Promise<InspectionBuildingCourseLane> {
        return this.http.get('inspection/courselane/' + idInspectionCourseLane)
            .pipe(map(response => response))
            .toPromise();
    }

    public save(courseLane: InspectionBuildingCourseLane): Promise<any> {
        return this.http.post('inspection/courselane', JSON.stringify(courseLane))
            .pipe(map(response => response))
            .toPromise();
    }

    public delete(courseLane: InspectionBuildingCourseLane): Promise<any> {
        return this.http.delete('inspection/courselane/' + courseLane.id)
            .pipe(map(response => response))
            .toPromise();
    }

    public saveCourseLaneSequence(idInspectionCourseLane: string, sequence: number): Promise<any> {
        return this.http.post('inspection/courselane/' + idInspectionCourseLane + "/sequence/" + sequence)
            .pipe(map(response => response))
            .toPromise();
    }
}
