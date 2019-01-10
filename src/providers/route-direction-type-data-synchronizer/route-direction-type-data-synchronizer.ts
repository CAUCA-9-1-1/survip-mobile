import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {RouteDirection} from "../../models/route-direction";
import {BaseExpiringDataSynchronizerProvider} from "../base-expiring-data-synchronizer-provider";

@Injectable()
export class RouteDirectionTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<RouteDirection[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'route_direction', 'routedirection');
  }
}
