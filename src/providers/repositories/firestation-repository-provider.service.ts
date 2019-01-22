import {Injectable} from '@angular/core';
import {FirestationForlist} from '../../models/firestation';
import {Storage as OfflineStorage} from "@ionic/storage";
import {ExpiringCache} from "../expiring-cache";

@Injectable()
export class FirestationRepositoryProvider {
    constructor(private storage: OfflineStorage) {
    }

    public getList(idCity: string): Promise<FirestationForlist[]> {
        return this.storage.get('firestations_by_city_' + idCity)
          .then((cache: ExpiringCache<FirestationForlist[]>) => cache.data);
    }
}
