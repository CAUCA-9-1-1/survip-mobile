export class InspectionVisit {
    idInspection: string;
    status: number;
    reasonForInspectionRefusal: string;
    hasBeenRefused: boolean;
    OwnerWasAbsent: boolean;
    DoorHangerHasBeenLeft: boolean;
    endedOn: Date;
    RequestedDateOfVisit: Date;
    isVacant: boolean;
    isSeasonal: boolean;
    isActive: boolean;

  hasBeenModified: boolean = false;
}
