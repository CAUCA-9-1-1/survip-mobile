import { Injectable } from '@angular/core';
import {HttpService} from '../../base/http.service';
import {Storage as OfflineStorage} from '@ionic/storage';
import { BaseExpiringDataSynchronizerProvider } from '../../base/base-expiring-data-synchronizer-provider';
import { GenericType } from 'src/app/shared/models/generic-type';

@Injectable()
export class PersonRequiringAssistanceTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<GenericType[]> {
  constructor(private http: HttpService, private storage: OfflineStorage) {
    super(http, storage, 'person_requiring_assistance_type', 'personrequiringassistancetype/localized');
  }
}
