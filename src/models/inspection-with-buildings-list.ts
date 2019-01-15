import {InspectionBuildingForList} from "./inspection-building-for-list";
import {InspectionConfiguration} from "./inspection-configuration";

export class InspectionWithBuildingsList {
  id: string;
  idSurvey: string;
  isSurveyCompleted: string;
  status: number;
  coordinates: string;
  idLaneTransversal: string;
  hasBeenModified: boolean = false;

  buildings: InspectionBuildingForList[];
  configuration: InspectionConfiguration;
}
