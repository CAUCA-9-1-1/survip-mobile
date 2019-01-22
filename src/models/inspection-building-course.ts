import {InspectionBuildingCourseLane} from "./inspection-building-course-lane";

export class InspectionBuildingCourse {
  id : string;
  idBuilding : string;
  idFirestation : string;

  isActive: boolean = true;
  hasBeenModified: boolean = false;

  lanes: InspectionBuildingCourseLane[];
}
