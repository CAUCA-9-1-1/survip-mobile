import {HttpService} from "./Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {ExpiringCache} from "./expiring-cache";

export abstract class BaseDataSynchronizerProvider<T> {
  public readonly storageKey: string;
  protected readonly baseUrl: string;

  protected constructor(
    private httpService: HttpService,
    private offlineStorage: OfflineStorage,
    private key: string,
    private url: string) {
    this.storageKey = key;
    this.baseUrl = url;
  }

  public synchAll(): Promise<boolean> {
    return this.valueIsCachedAndStillValid()
      .then(isValid => {
        if (isValid) {
          return Promise.resolve(true);
        }else{
          return this.retrieveFromApi();
        }
      });
  }

  protected retrieveFromApi(): Promise<boolean>{
    return new Promise((resolve) => {
      this.httpService.get(this.baseUrl)
        .pipe(map(response => response))
        .subscribe(
          async (data: T) => {
            await this.saveValueToStorage(data);
            resolve(true);
          },
           () => this.valueIsCached()
        );
    });
  }

  protected async saveValueToStorage(value: T) {
    const cache = new ExpiringCache<T>();
    cache.data = value;
    cache.expiredOn = this.addDays(new Date(), 7);
    await this.offlineStorage.set(this.storageKey, cache);
  }

  private addDays(date: Date, dayToAdd: number): Date {
    date.setDate(date.getDate() + dayToAdd);
    return date;
  }

  protected async valueIsCached(): Promise<boolean> {
    const cache = await this.offlineStorage.get(this.storageKey);
    return cache != null;
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

  public cacheIsExpired(cache: ExpiringCache<T>): boolean {
    const date = new Date();
    return cache.expiredOn < date;
  }
}

