import {InspectionBuildingForList} from "./inspection-building-for-list";
import {InspectionConfiguration} from "./inspection-configuration";

export class InspectionWithBuildingsList {
  id: string;
  idSurvey: string;
  isSurveyCompleted: string;
  status: number;

  buildings: InspectionBuildingForList[];
  configuration: InspectionConfiguration;
}
