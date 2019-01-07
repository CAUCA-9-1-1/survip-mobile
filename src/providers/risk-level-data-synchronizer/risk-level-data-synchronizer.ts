import { Injectable } from '@angular/core';
import {map} from "rxjs/operators";
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from '@ionic/storage';
import {RiskLevel} from "../../models/risk-level";

@Injectable()
export class RiskLevelDataSynchronizerProvider {

  constructor(private http: HttpService, private storage: OfflineStorage) {
  }

  public synchAll(): Promise<boolean> {

    return new Promise((resolve) => {
      this.http.get('risklevel/localized')
        .pipe(map(response => response))
        .subscribe(
          async (data: RiskLevel[]) => {
            await this.storage.set('risk_level', data);
            resolve(true);
          },
          () => resolve(false)
        );
    });
  }
}
