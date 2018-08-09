export class FireHydrant {
    id="";
    createdOn = "";
    isActive = true;
    locationType = 0;
    coordinates = [];
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
    idOperatorTypeRate = "";
    idUnitOfMeasureRate = "";
    idOperatorTypePressure = "";
    idUnitOfMeasurePressure = "";
    civicNumber="";
    addressLocationType="";
    physicalLocation="";
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

