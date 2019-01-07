import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {AllConstructionTypes} from "../../models/all-construction-types";
import {map} from "rxjs/operators";
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class ConstructionTypeDataSynchronizerProvider {

  constructor(private http: HttpService, private storage: OfflineStorage) {
  }

  public synchAll(): Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get('construction/all')
        .pipe(map(response => response))
        .subscribe(
          async (data: AllConstructionTypes) => {
            await this.storage.set('construction_types', data);
            resolve(true);
          },
          () => resolve(false)
        );
    });
  }
}
