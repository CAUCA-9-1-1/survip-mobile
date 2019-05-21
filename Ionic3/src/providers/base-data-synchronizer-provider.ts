import {HttpService} from "./Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {map} from "rxjs/operators";

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

  public synchronizeAll(): Promise<boolean> {
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
    await this.offlineStorage.set(this.storageKey, value);
  }

  protected async valueIsCachedAndStillValid(): Promise<boolean> {
    const cache = await this.offlineStorage.get(this.storageKey);
    if (cache != null) {
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }
}
