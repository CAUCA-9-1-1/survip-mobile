import {Injectable} from '@angular/core';
// tslint:disable-next-line: quotemark
import {Storage as OfflineStorage} from "@ionic/storage";
import { CityWithRegion } from 'src/app/shared/models/city-with-region';

@Injectable({providedIn: 'root'})
export class CityRepositoryProvider {

    constructor(private storage: OfflineStorage) {
    }

    public getCity(idCity: string): Promise<CityWithRegion> {
      return this.storage.get('city_' + idCity);
    }
}
