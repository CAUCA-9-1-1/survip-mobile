import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Batch} from '../../models/batch';
import {Storage as OfflineStorage} from "@ionic/storage";
import {Inspection} from "../../interfaces/inspection.interface";
import {InspectionWithBuildingsList} from "../../models/inspection-with-buildings-list";
import {HttpService} from "../Base/http.service";
import {TranslateService} from "@ngx-translate/core";
import {InspectionVisit} from "../../models/inspection-visit";
import {InspectionUploaderProvider} from "../inspection-uploader/inspection-uploader";

@Injectable()
export class InspectionRepositoryProvider {
  public labels = {};
  public inspectionStatusEnum = {
    'ToTransmit': -1,
    'Todo': 0,
    'Started': 1,
    'WaitingForApprobation': 2,
    'Approved': 3,
    'Refused': 4,
    'Canceled': 5
  };
  public inspectionVisitStatusEnum = {'Todo': 0, 'Started': 1, 'Completed': 2, 'WaitingForApprobation': 3, 'Refused': 4, 'Canceled': 5};

  constructor(
    private http: HttpService,
    private storage: OfflineStorage,
    private uploader: InspectionUploaderProvider,
    private translateService: TranslateService) {
    this.translateService.get([
      'generalInformation', 'Buildings', 'waterSupplies', 'implantationPlan', 'course',
      'inspectionStatusTodo', 'inspectionStatusStarted', 'inspectionStatusWaitingForApprobation', 'inspectionStatusApproved',
      'inspectionStatusRefused', 'inspectionStatusCanceled', 'visitStatusTodo', 'visitStatusStarted', 'inspectionStatusToTransmit',
      'visitStatusCompleted'
    ]).subscribe(labels => {
        this.labels = labels;
      },
      error => {
        console.log(error)
      });
  }

  public getInspectionStatusText(status: number) {
    return this.labels["inspectionStatus" + Object.keys(this.inspectionStatusEnum).find(e => this.inspectionStatusEnum[e] === status)];
  }

  public async getAll(): Promise<Batch[]> {
    const batches = await this.storage.get('batches');

    for (let batch of batches){
      for (let inspection of batch.inspections){
        const currentInspection = await this.getInspection(inspection.id);
        inspection.hasBeenDownloaded = currentInspection != null;
        if (currentInspection != null) {
          inspection.status = currentInspection.status;
          if (currentInspection.currentVisit.status == 2) {
            inspection.status = -1;
          }
        }
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
    inspection.currentVisit.status = this.inspectionVisitStatusEnum.Started;
    inspection.currentVisit.startedOn = new Date();
    inspection.status = this.inspectionStatusEnum.Started;
    inspection.startedOn = new Date();
    return await this.saveInspectionAndVisit(inspection);
  }

  public async refuseInspection(idInspection: string, ownerAbsent: boolean, doorHangerHasBeenLeft: boolean, refusalReason: string, requestedDateOfVisit: Date): Promise<InspectionWithBuildingsList> {
    const inspection = await this.getInspection(idInspection);

    if (inspection.currentVisit == null){
      inspection.currentVisit = new InspectionVisit();
      inspection.currentVisit.idInspection = idInspection;
      inspection.startedOn = new Date();
    }
    inspection.currentVisit.hasBeenModified = true;
    inspection.currentVisit.status = this.inspectionVisitStatusEnum.Completed;
    inspection.currentVisit.doorHangerHasBeenLeft = doorHangerHasBeenLeft;
    inspection.currentVisit.hasBeenRefused = !ownerAbsent;
    inspection.currentVisit.ownerWasAbsent = ownerAbsent;
    inspection.currentVisit.reasonForInspectionRefusal = refusalReason;
    inspection.currentVisit.requestedDateOfVisit = requestedDateOfVisit;
    inspection.currentVisit.endedOn = new Date();
    inspection.status = this.inspectionStatusEnum.Todo;

    return await this.saveInspectionAndVisit(inspection);
  }

  public async completeInspection(idInspection: string): Promise<InspectionWithBuildingsList> {
    const inspection = await this.getInspection(idInspection)

    const result = await this.uploader.uploadInspection(idInspection);
    console.log('uploaded', result);

    inspection.currentVisit.status = this.inspectionVisitStatusEnum.Completed;
    inspection.currentVisit.endedOn = new Date();
    inspection.status = this.inspectionStatusEnum.WaitingForApprobation;
    return await this.saveInspectionAndVisit(inspection);
  }

  private async saveInspectionAndVisit(inspection) {
    return this.http.post('Inspection', inspection).toPromise<boolean>().then(
      async (success) => {
        inspection.hasBeenModified = !success;
        inspection.currentVisit.hasBeenModified = !success;
        await this.save(inspection);
        return inspection;
      },
      async () => {
        inspection.currentVisit.hasBeenModified = false;
        inspection.hasBeenModified = false;
        await this.save(inspection);
        return inspection
      }
    );
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

  public CanUserAccessInspection(idInspection: string):Promise<boolean>{
    return this.http.get('inspection/' + idInspection + '/userAllowed')
      .toPromise()
      .then(result =>{
          // if we can access the api, we will and use the answer to decide if the user can start the inspection.
          return result;
        },
        () => {
          // If we can't access the api, we consider that the user can start the inspection no matter what.
          return true;
        });
  }
}
