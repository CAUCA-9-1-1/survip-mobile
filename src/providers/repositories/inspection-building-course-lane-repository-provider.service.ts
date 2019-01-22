import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from "@ionic/storage";
import {InspectionBuildingCourseRepositoryProvider} from "./inspection-building-course-repository";
import {InspectionBuildingCourseLane} from "../../models/inspection-building-course-lane";

@Injectable()
export class InspectionBuildingCourseLaneRepositoryProvider {
  constructor(private storage: OfflineStorage,
              private courseRepo: InspectionBuildingCourseRepositoryProvider) {
  }

  public getLane(idBuildingCourseLane: string): InspectionBuildingCourseLane {
    console.log('get lane', idBuildingCourseLane);
    return this.courseRepo.currentCourse.lanes.find(lane => lane.id == idBuildingCourseLane);
  }

  public save(courseLane: InspectionBuildingCourseLane): Promise<any> {
    courseLane.hasBeenModified = true;
    let lane = this.getLane(courseLane.id);
    console.log('lane', courseLane, lane);
    if (lane == null){

      this.courseRepo.currentCourse.lanes.push(courseLane);
    } else {
      Object.assign(lane, courseLane);
    }
    return this.courseRepo.save();
  }

  public delete(courseLane: InspectionBuildingCourseLane): Promise<any> {
    let lane = this.getLane(courseLane.id);
    lane.isActive = false;
    return this.courseRepo.save();
  }

  /*public saveCourseLaneSequence(idInspectionCourseLane: string, sequence: number): Promise<any> {
  }*/
}




  /*public save(courseLane: InspectionBuildingCourseLane): Promise<any> {
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
}*/
