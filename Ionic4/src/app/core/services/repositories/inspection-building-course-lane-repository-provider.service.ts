import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from "@ionic/storage";
import {InspectionBuildingCourseRepositoryProvider} from "./inspection-building-course-repository";
import {InspectionBuildingCourseLane} from "../../models/inspection-building-course-lane";
import {RouteDirectionRepositoryProvider} from "./route-direction-repository";
import {LaneRepositoryProvider} from "./lane-repository";

@Injectable()
export class InspectionBuildingCourseLaneRepositoryProvider {
  constructor(
    private storage: OfflineStorage,
    private courseRepo: InspectionBuildingCourseRepositoryProvider,
    private directionRepo: RouteDirectionRepositoryProvider,
    private laneRepo: LaneRepositoryProvider) {
  }

  public getLane(idBuildingCourseLane: string): InspectionBuildingCourseLane {
    return this.courseRepo.currentCourse.lanes.find(lane => lane.id == idBuildingCourseLane);
  }

  public save(courseLane: InspectionBuildingCourseLane): Promise<any> {
    courseLane.hasBeenModified = true;
    let lane = this.getLane(courseLane.id);
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
}
