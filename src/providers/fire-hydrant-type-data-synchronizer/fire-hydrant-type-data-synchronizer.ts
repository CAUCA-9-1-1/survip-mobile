import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {GenericType} from "../../models/generic-type";
import {BaseDataSynchronizerProvider} from "../base-data-synchronizer-provider";

@Injectable()
export class FireHydrantTypeDataSynchronizerProvider extends BaseDataSynchronizerProvider<GenericType[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'fire_hydrant_type', 'FireHydrantType/localized');
  }
}
