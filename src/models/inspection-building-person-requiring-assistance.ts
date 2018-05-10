export class InspectionBuildingPersonRequiringAssistance {
  id: string;
  idBuilding: string;
  idPersonRequiringAssistanceType: string;
  dayResidentCount: number = 0;
  eveningResidentCount: number = 0;
  nightResidentCount: number = 0;
  dayIsApproximate: boolean = false;
  eveningIsApproximate: boolean = false;
  nightIsApproximate: boolean = false;
  description: string = '';
  personName: string = '';
  floor: string = '';
  local: string = '';
  contactName: string = '';
  contactPhoneNumber: string = '';
}
