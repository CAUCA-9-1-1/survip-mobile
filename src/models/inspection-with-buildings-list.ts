import {InspectionBuildingForList} from "./inspection-building-for-list";
import {InspectionConfiguration} from "./inspection-configuration";
import {InspectionVisit} from "./inspection-visit";

export class InspectionWithBuildingsList {
  id: string;
  idSurvey: string;
  isSurveyCompleted: boolean;
  status: number;
  startedOn: Date;

  buildings: InspectionBuildingForList[];
  configuration: InspectionConfiguration;
  currentVisit: InspectionVisit;

  hasBeenModified: boolean = false;
}
