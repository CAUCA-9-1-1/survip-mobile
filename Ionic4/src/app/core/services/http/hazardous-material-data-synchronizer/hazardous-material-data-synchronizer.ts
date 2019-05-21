import { Injectable } from '@angular/core';
import {HttpService} from '../../base/http.service';
import {Storage as OfflineStorage} from '@ionic/storage';
import { BaseExpiringDataSynchronizerProvider } from '../../base/base-expiring-data-synchronizer-provider';
import { HazardousMaterialForList } from 'src/app/shared/models/hazardous-material-for-list';

@Injectable()
export class HazardousMaterialDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<HazardousMaterialForList[]> {
  constructor(private http: HttpService, private storage: OfflineStorage) {
    super(http, storage, 'hazardous_material', 'hazardousmaterial/localized');
    this.dayCountBeforeCacheIsExpired = 14;
  }
}
