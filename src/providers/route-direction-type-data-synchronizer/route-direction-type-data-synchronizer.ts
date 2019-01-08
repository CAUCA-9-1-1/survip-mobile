import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {RouteDirection} from "../../models/route-direction";
import {BaseDataSynchronizerProvider} from "../base-data-synchronizer-provider";

@Injectable()
export class RouteDirectionTypeDataSynchronizerProvider extends BaseDataSynchronizerProvider<RouteDirection[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'route_direction', 'routedirection');
  }
}
