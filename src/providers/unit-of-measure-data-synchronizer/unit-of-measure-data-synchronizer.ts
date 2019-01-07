import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {map} from "rxjs/operators";
import {UnitOfMeasure} from "../../models/all-construction-types";

@Injectable()
export class UnitOfMeasureDataSynchronizerProvider {

  private readonly baseUrl: string = "unitofmeasure/";

  constructor(private http: HttpService, private storage: OfflineStorage) {
  }

  public synchAll(): Promise<boolean> {
    return Promise.all([
      this.getAllByName('rate'),
      this.getAllByName('diameter'),
      this.getAllByName('pressure'),
      this.getAllByName('capacity'),
      this.getAllByName('dimension'),
      ])
      .then((responses: boolean[]) =>{
        return responses.every(response => response);
      });
  }

  private getAllByName(measureName: string) : Promise<boolean> {
    return new Promise((resolve) => {
      this.http.get('unitofmeasure/' + measureName)
        .pipe(map(response => response))
        .subscribe(
          async (data: UnitOfMeasure[]) => {
            await this.storage.set('unit_of_measure_' + measureName, data);
            resolve(true);
          },
          () => resolve(false)
        );
    });
  }
}
