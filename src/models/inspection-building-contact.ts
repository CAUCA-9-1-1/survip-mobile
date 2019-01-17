export class InspectionBuildingContact {
  id: string;
  idBuilding: string;
  firstName: string = "";
  lastName: string = "";
  callPriority: number = 0;
  phoneNumber: string = "";
  phoneNumberExtension: string = "";
  pagerNumber: string = "";
  pagerCode: string = "";
  cellphoneNumber: string = "";
  otherNumber: string = "";
  otherNumberExtension: string = "";
  isOwner: boolean = false;

  isActive: boolean = true;
  hasBeenModified: boolean = false;
}

