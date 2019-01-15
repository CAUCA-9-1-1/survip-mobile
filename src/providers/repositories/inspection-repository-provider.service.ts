import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Batch} from '../../models/batch';
import {Storage as OfflineStorage} from "@ionic/storage";
import {Inspection} from "../../interfaces/inspection.interface";
import {InspectionWithBuildingsList} from "../../models/inspection-with-buildings-list";

@Injectable()
export class InspectionRepositoryProvider {

  constructor(private storage: OfflineStorage) {
  }

  public async getAll(): Promise<Batch[]> {
    const batches = await this.storage.get('batches');

    for (let batch of batches){
      for (let inspection of batch.inspections){
        inspection.hasBeenDownloaded = await this.hasBeenDownloaded(inspection.id);
      }
    }

    return batches;
  }

  public async getResumedInspection(inspectionId: string): Promise<Inspection> {
    const batches = await this.storage.get('batches');

    for (let batch of batches){
      for (let inspection of batch.inspections){
        if (inspection.id == inspectionId)
          return inspection;
      }
    }

    return null;
  }

  public async getInspection(inspectionId: string): Promise<InspectionWithBuildingsList> {
    return await this.storage.get('inspection_buildings_' + inspectionId);
  }

  private async hasBeenDownloaded(idInspection: string): Promise<boolean>{
    return (await this.storage.get('inspection_buildings_' + idInspection)) != null;
  }


  /*public getResumedInspection(id: string): Promise<Inspection> {
      return this.http.getResumedInspection('api/inspection/' + id)
          .pipe(map(response => response));
  }*/
}
