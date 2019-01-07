import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {GenericType} from "../../models/generic-type";

@Injectable()
export class PersonRequiringAssistanceTypeDataSynchronizerProvider {
  constructor(private http: HttpService, private storage: OfflineStorage) {
  }

  public synchAll(): Promise<boolean> {

    return new Promise((resolve) => {
      this.http.get('personrequiringassistancetype/localized')
        .pipe(map(response => response))
        .subscribe(
          async (data: GenericType[]) => {
            await this.storage.set('person_requiring_assistance_type', data);
            resolve(true);
          },
          () => resolve(false)
        );
    });
  }
}
