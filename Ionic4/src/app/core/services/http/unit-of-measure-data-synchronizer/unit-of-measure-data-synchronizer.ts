import { Injectable } from '@angular/core';
import {HttpService} from '../../base/http.service';
import {Storage as OfflineStorage} from '@ionic/storage';
import { BaseExpiringDataSynchronizerProvider } from '../../base/base-expiring-data-synchronizer-provider';
import { UnitOfMeasure } from 'src/app/shared/models/unit-of-measure';

@Injectable()
export class UnitOfMeasureDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<UnitOfMeasure[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'unit_of_measure', 'unitofmeasure/all');
  }
}
