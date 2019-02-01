export class InspectionVisit {
    idInspection: string;
    status: number; // 0 = todo, 1 = started, 2 = completed.
    reasonForInspectionRefusal: string;
    hasBeenRefused: boolean;
    ownerWasAbsent: boolean;
    doorHangerHasBeenLeft: boolean;
    endedOn: Date;
    startedOn: Date;
    requestedDateOfVisit: Date;
    isVacant: boolean;
    isSeasonal: boolean;
    isActive: boolean;
    hasBeenModified: boolean = false;
}
