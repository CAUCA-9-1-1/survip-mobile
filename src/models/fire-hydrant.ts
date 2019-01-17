export class FireHydrant {
    id="";
    isActive = true;
    locationType = 0;
    coordinates = null;
    altitude=0;
    number:"";
    rateFrom=0;
    rateTo=0;
    pressureFrom=0;
    pressureTo=0;
    color="";
    comments="";
    idCity="";
    idLane="";
    idIntersection="";
    idFireHydrantType = "";
    rateOperatorType = 0;
    idUnitOfMeasureRate = "";
    pressureOperatorType = 0;
    idUnitOfMeasurePressure = "";
    civicNumber="";
    addressLocationType="";
    physicalPosition="";

  hasBeenModified: boolean = false;
};

export enum FireHydrantLocationType {
    Address,
    LaneAndIntersection,
    Coordinates,
    Text
};

export enum MeasureType{
    Rate,
    Pressure,
    Diameter,
    Capacity,
    Dimension
};

export enum AddressLocalisationType{
    NextTo,
    AtTheAddress,
    BackWard,
    AtEnd,
    AtCorner,
    Above,
    Under,
    InFront,
    Near,
    VisibleFrom
};

export enum OperatorType{
    Equal,
    Greater,
    GreaterOrEqual,
    Less,
    LessOrEqual
}
