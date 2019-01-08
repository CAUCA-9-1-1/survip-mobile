import {Injectable} from '@angular/core';
import {GenericType} from '../../models/generic-type';
import {Storage as OfflineStorage} from "@ionic/storage";
import {ExpiringCache} from "../expiring-cache";

@Injectable()
export class SprinklerTypeRepository {

    constructor(private storage: OfflineStorage,) {
    }

    public getAll(): Promise<GenericType[]> {
      return this.storage.get('sprinkler_type')
        .then((cache:ExpiringCache<GenericType[]>) => cache.data);
    }
}
