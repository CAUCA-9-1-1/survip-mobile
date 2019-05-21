import {Injectable} from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from '@ionic/storage';
import {RiskLevel} from "../../models/risk-level";
import {BaseExpiringDataSynchronizerProvider} from "../base-expiring-data-synchronizer-provider";

@Injectable()
export class RiskLevelDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<RiskLevel[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'risk_level', 'risklevel/localized');
  }
}
