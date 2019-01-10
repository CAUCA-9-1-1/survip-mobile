import {Injectable} from '@angular/core';
import {UnitOfMeasure} from '../../models/unit-of-measure';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class UnitOfMeasureRepositoryProvider {
  constructor(private storage: OfflineStorage,) {
  }

  public getAllForRate(): Promise<UnitOfMeasure[]> {
    return this.getAllOfType(0);
  }

  public getAllForPressure(): Promise<UnitOfMeasure[]> {
    return this.getAllOfType(1);
  }

  public getAllForDiameter(): Promise<UnitOfMeasure[]> {
    return this.getAllOfType(2);
  }

  public getAllForCapacity(): Promise<UnitOfMeasure[]> {
    return this.getAllOfType(3);
  }

  public getAllForDimension(): Promise<UnitOfMeasure[]> {
    return this.getAllOfType(4);
  }

  private getAllOfType(type: number): Promise<UnitOfMeasure[]> {
    return this.storage.get('unit_of_measure')
      .then(units => units.data.filter(unit => unit.measureType == type));
  }
}
