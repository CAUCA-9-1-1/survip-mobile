import { Injectable } from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { BaseExpiringDataSynchronizerProvider } from '../../base/base-expiring-data-synchronizer-provider';
import { RiskLevel } from 'src/app/shared/models/risk-level';
import { HttpService } from '../../base/http.service';

@Injectable()
export class AlarmTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<RiskLevel[]> {
  constructor(private http: HttpService, private storage: OfflineStorage) {
    super(http, storage, 'alarm_panel_type', 'alarmpaneltype');
  }
}
