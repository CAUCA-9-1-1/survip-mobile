import { Injectable } from '@angular/core';
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {UnitOfMeasure} from "../../models/unit-of-measure";
import {BaseDataSynchronizerProvider} from "../base-data-synchronizer-provider";

@Injectable()
export class UnitOfMeasureDataSynchronizerProvider extends BaseDataSynchronizerProvider<UnitOfMeasure[]> {
  constructor(private http: HttpService, private storage: OfflineStorage){
    super(http, storage, 'unit_of_measure', 'unitofmeasure/all');
  }
}
