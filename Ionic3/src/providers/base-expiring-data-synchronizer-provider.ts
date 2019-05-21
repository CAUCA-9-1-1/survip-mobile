import {HttpService} from "./Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {ExpiringCache} from "./expiring-cache";

export abstract class BaseExpiringDataSynchronizerProvider<T>{

  public readonly storageKey: string;
  public dayCountBeforeCacheIsExpired: number = 7;

  protected readonly baseUrl: string;

  protected constructor(
    private httpService: HttpService,
    private offlineStorage: OfflineStorage,
    private key: string,
    private url: string) {
    this.storageKey = key;
    this.baseUrl = url;
  }

  public synchronizeAllWhenNecessary(): Promise<boolean> {
    return this.valueIsCachedAndStillValid()
      .then(isValid => {
        if (isValid) {
          return Promise.resolve(true);
        } else {
          return this.retrieveFromApi();
        }
      });
  }

  protected retrieveFromApi(): Promise<boolean> {
    return new Promise((resolve) => {
      this.httpService.get(this.baseUrl)
        .pipe(map(response => response))
        .subscribe(
          async (data: T) => {
            await this.saveValueToStorage(data);
            resolve(true);
          },
          async () => resolve(await this.valueIsCached())
        );
    });
  }

  protected async valueIsCached(): Promise<boolean> {
    const cache = await this.offlineStorage.get(this.storageKey);
    return cache != null;
  }

  protected async saveValueToStorage(value: T) {
    const cache = new ExpiringCache<T>();
    cache.data = value;
    cache.expiredOn = this.addDays(new Date(), this.dayCountBeforeCacheIsExpired);
    await this.offlineStorage.set(this.storageKey, cache);
  }

  private addDays(date: Date, dayToAdd: number): Date {
    date.setDate(date.getDate() + dayToAdd);
    return date;
  }

  protected async valueIsCachedAndStillValid(): Promise<boolean>{
    const cache = await this.offlineStorage.get(this.storageKey);
    if (cache != null) {
      const isExpired = this.cacheIsExpired(cache);
      return Promise.resolve(!isExpired);
    }
    else {
      return Promise.resolve(false);
    }
  }

  protected cacheIsExpired(cache: ExpiringCache<T>): boolean {
    const date = new Date();
    return cache.expiredOn < date;
  }
}
