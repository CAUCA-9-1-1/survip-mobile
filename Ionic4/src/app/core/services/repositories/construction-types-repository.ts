import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { AllConstructionTypes } from 'src/app/shared/models/all-construction-types';
import { ExpiringCache } from '../base/expiring-cache';

@Injectable()
export class ConstructionTypesRepositoryProvider {

    constructor(private storage: OfflineStorage) {
    }

    public getAllTypes(): Promise<AllConstructionTypes> {
        return this.storage.get('construction_type')
          .then((cache: ExpiringCache<AllConstructionTypes>) => cache.data);
    }
}
