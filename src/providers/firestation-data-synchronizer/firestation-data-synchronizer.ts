import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {ExpiringCache} from "../expiring-cache";
import {FirestationForlist} from "../../models/firestation";

@Injectable()
export class FirestationDataSynchronizerProvider {

  protected readonly baseUrl: string = 'city/';
  public readonly baseStorageKey: string = 'firestations_by_city_';

  constructor(
    private httpService: HttpService,
    private offlineStorage: OfflineStorage) {
  }

  public synchAll(cityIds: string[]): Promise<boolean>[] {
    return cityIds.map(cityId => this.synch(cityId));
  }

  private synch(cityId: string): Promise<boolean> {
    return this.valueIsCachedAndStillValid(cityId)
      .then(isValid => {
        if (isValid) {
          return Promise.resolve(true);
        } else {
          return this.retrieveFromApi(cityId);
        }
      });
  }

  protected retrieveFromApi(cityId: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.httpService.get(this.baseUrl + cityId + '/firestations')
        .pipe(map(response => response))
        .subscribe(
          async (data: FirestationForlist[]) => {
            await this.saveValueToStorage(data, cityId);
            resolve(true);
          },
          async () => resolve(await this.valueIsCached(cityId))
        );
    });
  }

  protected async saveValueToStorage(value: FirestationForlist[], cityId: string) {
    const cache = new ExpiringCache<FirestationForlist[]>();
    cache.data = value;
    cache.expiredOn = this.addDays(new Date(), 7);
    await this.offlineStorage.set(this.baseStorageKey + cityId, cache);
  }

  protected async valueIsCached(cityId: string): Promise<boolean> {
    const cache = await this.offlineStorage.get(this.baseStorageKey + cityId);
    return cache != null;
  }

  private addDays(date: Date, dayToAdd: number): Date {
    date.setDate(date.getDate() + dayToAdd);
    return date;
  }

  protected async valueIsCachedAndStillValid(cityId: string): Promise<boolean> {
    const cache = await this.offlineStorage.get(this.baseStorageKey + cityId);
    if (cache != null) {
      const isExpired = this.cacheIsExpired(cache);
      return Promise.resolve(!isExpired);
    } else {
      return Promise.resolve(false);
    }
  }

  protected cacheIsExpired(cache: ExpiringCache<FirestationForlist[]>): boolean {
    const date = new Date();
    return cache.expiredOn < date;
  }
}
