import {Injectable} from '@angular/core';
import {Storage as OfflineStorage} from '@ionic/storage';
import { GenericType } from 'src/app/shared/models/generic-type';
import { ExpiringCache } from '../base/expiring-cache';

@Injectable({providedIn: 'root'})
export class PersonRequiringAssistanceTypeRepositoryProvider {

    constructor(private storage: OfflineStorage) {
    }

    public getAll(): Promise<GenericType[]> {
      return this.storage.get('person_requiring_assistance_type')
        .then((cache: ExpiringCache<GenericType[]>) => cache.data);
    }
}


