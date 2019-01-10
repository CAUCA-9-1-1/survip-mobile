import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {AllConstructionTypes} from "../../models/all-construction-types";
import {Storage as OfflineStorage} from "@ionic/storage";
import {BaseExpiringDataSynchronizerProvider} from "../base-expiring-data-synchronizer-provider";

@Injectable()
export class ConstructionTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<AllConstructionTypes> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'construction_type', 'construction/all');
  }
}
