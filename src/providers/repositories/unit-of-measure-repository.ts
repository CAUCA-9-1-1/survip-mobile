import {Injectable} from '@angular/core';
import {UnitOfMeasure} from '../../models/all-construction-types';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class UnitOfMeasureRepositoryProvider {
    constructor(private storage: OfflineStorage,) {
    }

    public  getAllForRate(): Promise<UnitOfMeasure[]> {
      return this.storage.get('unit_of_measure_rate');
    }

    public getAllForDiameter(): Promise<UnitOfMeasure[]> {
      return this.storage.get('unit_of_measure_diameter');
    }

    public getAllForPressure(): Promise<UnitOfMeasure[]> {
      return this.storage.get('unit_of_measure_pressure');
    }

    public getAllForCapacity(): Promise<UnitOfMeasure[]> {
      return this.storage.get('unit_of_measure_capacity');
    }

    public getAllForDimension(): Promise<UnitOfMeasure[]> {
      return this.storage.get('unit_of_measure_dimension');
    }
}
