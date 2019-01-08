import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {BaseDataSynchronizerProvider} from "../base-data-synchronizer-provider";
import {RiskLevel} from "../../models/risk-level";

@Injectable()
export class AlarmTypeDataSynchronizerProvider extends BaseDataSynchronizerProvider<RiskLevel[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'alarm_panel_type', 'alarmpaneltype');
  }
}
