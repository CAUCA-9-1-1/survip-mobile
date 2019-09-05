export class InspectionBuildingSprinkler {
  id: string;
  idBuilding: string;
  idSprinklerType: string;
  floor: string;
  wall: string;
  sector: string;
  pipeLocation: string;
  collectorLocation: string;

  isActive: boolean = true;
  hasBeenModified: boolean = false;
}
