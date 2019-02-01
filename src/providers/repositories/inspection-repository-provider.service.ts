import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Batch} from '../../models/batch';
import {Storage as OfflineStorage} from "@ionic/storage";
import {Inspection} from "../../interfaces/inspection.interface";
import {InspectionWithBuildingsList} from "../../models/inspection-with-buildings-list";
import {HttpService} from "../Base/http.service";

@Injectable()
export class InspectionRepositoryProvider {

  constructor(
    private http: HttpService,
    private storage: OfflineStorage) {
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

  public async startInspection(idInspection: string): Promise<InspectionWithBuildingsList> {
    const inspection = await this.getInspection(idInspection)
    inspection.currentVisit.hasBeenModified = true;
    inspection.currentVisit.status = 1; // started
    inspection.currentVisit.startedOn = new Date();
    inspection.status = 1; // started
    inspection.startedOn = new Date();
    return this.http.post('Inspection', inspection).toPromise<boolean>().then(
      async (success) => {
          inspection.hasBeenModified = !success;
          await this.save(inspection);
          return inspection;
      },
    async () => {
          inspection.hasBeenModified = false;
          await this.save(inspection);
          return inspection
      }
    )
  }

  public async hasBeenDownloaded(idInspection: string): Promise<boolean>{
    return (await this.storage.get('inspection_buildings_' + idInspection)) != null;
  }

  public save(inspection: InspectionWithBuildingsList): Promise<boolean> {
    return this.storage.set('inspection_buildings_' + inspection.id, inspection);
  }

  public async saveCurrentInspection(inspection: InspectionWithBuildingsList) {
    const batches = await this.storage.get('batches');
    for (let batch of batches){
      for (let current of batch.inspections){
        if (current.id == inspection.id) {
          current.status = inspection.status;
          current.hasBeenDownloaded = true;
          return await this.storage.set('batches', batches);
        }
      }
    }
    return false;
  }
}
