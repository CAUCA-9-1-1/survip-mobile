import {TypeForConstruction} from './type-for-construction';

export class AllConstructionTypes {
  buildingTypes: TypeForConstruction[];
  constructionFireResistanceTypes: TypeForConstruction[];
  constructionTypes: TypeForConstruction[];
  roofMaterialTypes: TypeForConstruction[];
  roofTypes: TypeForConstruction[];
}

export class UnitOfMeasure {
  id: string;
  name: string;
}
