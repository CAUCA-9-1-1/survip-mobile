import { Injectable } from '@angular/core';
import {BaseDataSynchronizerProvider} from "../base-data-synchronizer-provider";
import {Batch} from "../../models/batch";
import {HttpService} from "../Base/http.service";
import {Storage as OfflineStorage} from "@ionic/storage";
import {InspectionBuildingsList} from "../../models/inspection-buildings-list";
import {map} from "rxjs/operators";

@Injectable()
export class InspectionDataSynchronizerProvider extends BaseDataSynchronizerProvider<Batch[]> {

  constructor(
    private service: HttpService,
    private storage: OfflineStorage) {
    super(service, storage, 'batches', 'inspection')
  }

  public downloadInspection(idInspection: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.service.get('inspection/' + idInspection + '/buildinglist')
        .pipe(map(response => response))
        .subscribe(
          async (data: InspectionBuildingsList) => {
            await this.saveInspection(data);
            resolve(true);
          },
          async () => resolve(false)
        );
    });
  }

  private saveInspection(inspection: InspectionBuildingsList) : Promise<boolean>{
    return this.storage.set('inspection_buildings_' + inspection.id, inspection);
  }
}
