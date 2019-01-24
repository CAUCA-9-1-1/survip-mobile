import { Injectable } from '@angular/core';
import {BaseExpiringDataSynchronizerProvider} from "../base-expiring-data-synchronizer-provider";
import {GenericType} from "../../models/generic-type";
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class AnomalyThemeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<GenericType[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'anomaly_themes', 'inspection/anomalythemes');
  }
}
