import {Injectable} from '@angular/core';
import {RouteDirection} from '../../models/route-direction';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class RouteDirectionRepositoryProvider {

    constructor(private storage: OfflineStorage,) {
    }

    public getList(): Promise<RouteDirection[]> {
      return this.storage.get('route_direction');
    }
}
