import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {RouteDirection} from "../../models/route-direction";

@Injectable()
export class RouteDirectionTypeDataSynchronizerProvider {
  constructor(private http: HttpService, private storage: OfflineStorage) {
  }

  public synchAll(): Promise<boolean> {

    return new Promise((resolve) => {
      this.http.get('routedirection')
        .pipe(map(response => response))
        .subscribe(
          async (data: RouteDirection[]) => {
            await this.storage.set('route_direction', data);
            resolve(true);
          },
          () => resolve(false)
        );
    });
  }
}
