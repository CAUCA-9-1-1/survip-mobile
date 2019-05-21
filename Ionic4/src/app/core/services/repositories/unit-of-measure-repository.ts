import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { UnitOfMeasure } from 'src/app/shared/models/unit-of-measure';

@Injectable()
export class UnitOfMeasureRepositoryProvider {
  constructor(private storage: OfflineStorage) {
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
      .then(units => units.data.filter(unit => unit.measureType === type));
  }
}
