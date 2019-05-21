import {Injectable} from '@angular/core';
import {CityWithRegion} from "../../models/city-with-region";
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class CityRepositoryProvider {

    constructor(private storage: OfflineStorage) {
    }

    public getCity(idCity: string): Promise<CityWithRegion> {
      return this.storage.get('city_' + idCity);
    }
}
