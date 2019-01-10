import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {BaseExpiringDataSynchronizerProvider} from "../base-expiring-data-synchronizer-provider";
import {RiskLevel} from "../../models/risk-level";

@Injectable()
export class AlarmTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<RiskLevel[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'alarm_panel_type', 'alarmpaneltype');
  }
}
