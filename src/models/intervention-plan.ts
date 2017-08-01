export class InterventionPlan {
  id: string;
  planNumber: string;
  planName: string;
  idLaneTransversal: string;
  idPictureSitePlan: string;
  otherInformation: string;
  createdOn: Date;
  /*revisedOn: Date;
  approvedOn: Date;*/
  isActive: boolean;
  idCity: string;
  mainBuildingAddress: string;
  mainBuildingIdLane: string;
  mainBuildingAlias: string;
  mainBuildingIdRiskLevel: string;
  mainBuildingMatricule: string;
  mainBuildingAffectation: string;
  mainBuildingRiskLevelName: string;
  mainBuildingLaneName: string;
}
