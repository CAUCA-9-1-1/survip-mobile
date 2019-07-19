import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { RouteDirection } from 'src/app/shared/models/route-direction';
import { ExpiringCache } from '../base/expiring-cache';

@Injectable({providedIn: 'root'})
export class RouteDirectionRepositoryProvider {

    constructor(private storage: OfflineStorage) {
    }

    public getList(): Promise<RouteDirection[]> {
      return this.storage.get('route_direction')
        .then((cache: ExpiringCache<RouteDirection[]>) => cache.data);
    }
}
