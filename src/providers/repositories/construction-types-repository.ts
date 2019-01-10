import {Injectable} from '@angular/core';
import {AllConstructionTypes} from '../../models/all-construction-types';
import {Storage as OfflineStorage} from "@ionic/storage";
import {ExpiringCache} from "../expiring-cache";

@Injectable()
export class ConstructionTypesRepositoryProvider {

    constructor(private storage: OfflineStorage) {
    }

    public getAllTypes(): Promise<AllConstructionTypes> {
        return this.storage.get('construction_type')
          .then((cache:ExpiringCache<AllConstructionTypes>) => cache.data);
    }
}
