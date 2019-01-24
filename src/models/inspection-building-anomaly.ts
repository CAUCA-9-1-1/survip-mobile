import {InspectionPictureForWeb} from "./inspection-picture-for-web";

export class InspectionBuildingAnomaly {
  id = '';
  idBuilding = '';
  theme = '';
  notes = '';

  isActive: boolean = true;
  hasBeenModified: boolean = false;
}

export class InspectionBuildingAnomalyPictures {
  id: string;
  pictures: InspectionPictureForWeb[];
}
