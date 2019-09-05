import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { FirestationForlist } from 'src/app/shared/models/firestation';
import { ExpiringCache } from '../base/expiring-cache';

@Injectable({providedIn: 'root'})
export class FirestationRepositoryProvider {
    constructor(private storage: OfflineStorage) {
    }

    public getList(idCity: string): Promise<FirestationForlist[]> {
        return this.storage.get('firestations_by_city_' + idCity)
          .then((cache: ExpiringCache<FirestationForlist[]>) => cache.data);
    }
}
