import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {InspectionBuildingCourseLane} from '../../models/inspection-building-course-lane';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class InspectionBuildingCourseLaneRepositoryProvider {
  constructor(private storage: OfflineStorage) {
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
