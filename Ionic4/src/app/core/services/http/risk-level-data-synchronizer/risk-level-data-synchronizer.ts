import {Injectable} from '@angular/core';
import {HttpService} from '../../base/http.service';
import {Storage as OfflineStorage} from '@ionic/storage';
import { BaseExpiringDataSynchronizerProvider } from '../../base/base-expiring-data-synchronizer-provider';
import { RiskLevel } from 'src/app/shared/models/risk-level';

@Injectable()
export class RiskLevelDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<RiskLevel[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'risk_level', 'risklevel/localized');
  }
}
