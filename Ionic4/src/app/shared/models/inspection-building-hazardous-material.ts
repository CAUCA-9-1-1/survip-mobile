export class InspectionBuildingHazardousMaterial {
  id: string;
  idBuilding: string;
  idHazardousMaterial: string;
  quantity: number = 0;
  tankType: number = 0;
  idUnitOfMeasure: string = '';
  container: string = '';
  capacityContainer: number = 0;
  place: string = '';
  floor: string = '';
  wall: string = '';
  sector: string = '';
  gasInlet: string = '';
  securityPerimeter: string = '';
  otherInformation: string = '';

  isActive: boolean = true;
  hasBeenModified: boolean = false;
}

export enum TankType {
  Undetermined,
  Underground,
  Aboveground
}
