import { Injectable } from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { BaseExpiringDataSynchronizerProvider } from '../../base/base-expiring-data-synchronizer-provider';
import { GenericType } from 'src/app/shared/models/generic-type';
import { HttpService } from '../../base/http.service';

@Injectable()
export class FireHydrantTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<GenericType[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'fire_hydrant_type', 'FireHydrantType/localized');
  }
}
