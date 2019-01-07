import {Injectable} from '@angular/core';
import {AllConstructionTypes} from '../../models/all-construction-types';
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class ConstructionTypesRepositoryProvider {

    constructor(private storage: OfflineStorage) {
    }

    public getAllTypes(): Promise<AllConstructionTypes> {
        return this.storage.get('construction_types');
    }
}
