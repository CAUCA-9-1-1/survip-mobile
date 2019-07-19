import { Injectable } from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { BaseExpiringDataSynchronizerProvider } from '../../base/base-expiring-data-synchronizer-provider';
import { AllConstructionTypes } from 'src/app/shared/models/all-construction-types';
import { HttpService } from '../../base/http.service';

@Injectable({providedIn: 'root'})
export class ConstructionTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<AllConstructionTypes> {
  constructor(private http: HttpService, private storage: OfflineStorage) {
    super(http, storage, 'construction_type', 'construction/all');
  }
}
