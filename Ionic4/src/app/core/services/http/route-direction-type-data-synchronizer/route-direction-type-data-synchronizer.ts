import { Injectable } from '@angular/core';
import {HttpService} from '../../base/http.service';
import {Storage as OfflineStorage} from '@ionic/storage';
import { BaseExpiringDataSynchronizerProvider } from '../../base/base-expiring-data-synchronizer-provider';
import { RouteDirection } from 'src/app/shared/models/route-direction';

@Injectable()
export class RouteDirectionTypeDataSynchronizerProvider extends BaseExpiringDataSynchronizerProvider<RouteDirection[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'route_direction', 'routedirection');
  }
}
