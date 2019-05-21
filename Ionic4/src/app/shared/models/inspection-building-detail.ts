export class InspectionBuildingDetail {
  id: string;
  idBuilding: string;
  height: number;
  idUnitOfMeasureHeight: string;
  estimatedWaterFlow: number;
  idUnitOfMeasureEstimatedWaterFlow: string;
  garageType: number;
  idConstructionType: string;
  idConstructionFireResistanceType: string;
  idRoofType: string;
  idRoofMaterialType: string;
  idBuildingType: string;
  idBuildingSidingType: string;

  idPicturePlan: string;

  isActive: boolean = true;
  hasBeenModified: boolean = false;
}

export enum GarageType {
  No,
  Yes,
  Detached
}
