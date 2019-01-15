import { Injectable } from '@angular/core';
import {BaseDataSynchronizerProvider} from "../base-data-synchronizer-provider";
import {Batch} from "../../models/batch";
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {InspectionWithBuildingsList} from "../../models/inspection-with-buildings-list";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable()
export class InspectionDataSynchronizerProvider extends BaseDataSynchronizerProvider<Batch[]> {

  constructor(
    private service: HttpService,
    private storage: OfflineStorage) {
    super(service, storage, 'batches', 'inspection')
  }

  public downloadInspection(idInspection: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.getInspection(idInspection)
        .subscribe(
          async (data: InspectionWithBuildingsList) => {
            await this.saveInspection(data);
            resolve(true);
          },
          async () => resolve(false)
        );
    });
  }

  public getInspection(idInspection: string): Observable<InspectionWithBuildingsList>{
    return this.service.get('inspection/' + idInspection + '/buildinglist')
      .pipe(map(response => response));
  }

  private saveInspection(inspection: InspectionWithBuildingsList) : Promise<boolean>{
    return this.storage.set('inspection_buildings_' + inspection.id, inspection);
  }
}
