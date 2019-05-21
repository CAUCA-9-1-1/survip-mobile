export class InspectionBuildingParticularRisk {
  id: string;
  idBuilding: string;
  hasOpening: boolean = false;
  isWeakened: boolean = false;
  comments: string = '';
  wall: string;
  sector: string;
  dimension: string = '';

  isActive: boolean = true;
  hasBeenModified: boolean = false;
}
