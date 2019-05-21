import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Storage as OfflineStorage} from '@ionic/storage';
import {HttpService} from '../Base/http.service';
import {TranslateService} from '@ngx-translate/core';
import { InspectionDataSynchronizerProvider } from '../http/inspection-data-synchronizer/inspection-data-synchronizer';
import { Batch } from 'src/app/shared/models/batch';
import { Inspection } from 'src/app/shared/interfaces/inspection.interface';
import { InspectionWithBuildingsList } from 'src/app/shared/models/inspection-with-buildings-list';
import { InspectionVisit } from 'src/app/shared/models/inspection-visit';
import { InspectionUploaderProvider } from '../controllers/inspection-uploader/inspection-uploader';

@Injectable()
export class InspectionRepositoryProvider {
  public labels = {};
  public inspectionStatusEnum = {
    ToTransmit: -1,
    Todo: 0,
    Started: 1,
    WaitingForApprobation: 2,
    Approved: 3,
    Refused: 4,
    Canceled: 5
  };
  public inspectionVisitStatusEnum = {Todo: 0, Started: 1, Completed: 2, WaitingForApprobation: 3, Refused: 4, Canceled: 5};

  constructor(
    private http: HttpService,
    private storage: OfflineStorage,
    private synchronizer: InspectionDataSynchronizerProvider,
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
        console.log(error);
      });
  }

  public getInspectionStatusText(status: number) {
    return this.labels['inspectionStatus' + Object.keys(this.inspectionStatusEnum).find(e => this.inspectionStatusEnum[e] === status)];
  }

  public async getAll(): Promise<Batch[]> {
    const batches = await this.storage.get('batches');

    for (const batch of batches) {
      batch.hasBeenFullyDownloaded = false;
      batch.notDownloadedInspectionIds = [];
      for (const inspection of batch.inspections) {
        const currentInspection = await this.getInspection(inspection.id);
        inspection.hasBeenDownloaded = currentInspection != null;

        if (!inspection.hasBeenDownloaded) {
          batch.notDownloadedInspectionIds.push(inspection.id);
        }

        if (currentInspection != null) {
          inspection.status = currentInspection.status;
          if (currentInspection.currentVisit.status === 2) {
            inspection.status = -1;
          }
        }
      }
      batch.hasBeenFullyDownloaded = batch.notDownloadedInspectionIds.length === 0;
    }

    return batches;
  }

  public async getResumedInspection(inspectionId: string): Promise<Inspection> {
    const batches = await this.storage.get('batches');

    for (const batch of batches) {
      for (const inspection of batch.inspections) {
        if (inspection.id === inspectionId) {
          return inspection;
        }
      }
    }

    return null;
  }

  public async getInspection(inspectionId: string): Promise<InspectionWithBuildingsList> {
    return await this.storage.get('inspection_buildings_' + inspectionId);
  }

  public async startInspection(idInspection: string): Promise<boolean> {
    const inspection = await this.getInspection(idInspection);
    inspection.currentVisit.hasBeenModified = true;
    inspection.currentVisit.status = this.inspectionVisitStatusEnum.Started;
    inspection.currentVisit.startedOn = new Date();
    inspection.currentVisit.requestedDateOfVisit = null;
    inspection.status = this.inspectionStatusEnum.Started;
    inspection.startedOn = new Date();
    return await this.saveInspectionAndVisit(inspection, true);
  }

  public async refuseInspection(
    idInspection: string,
    ownerAbsent: boolean,
    doorHangerHasBeenLeft: boolean,
    refusalReason: string,
    requestedDateOfVisit: Date): Promise<boolean> {

    const inspection = await this.getInspection(idInspection);

    if (inspection.currentVisit == null) {
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

    return await this.saveInspectionAndVisit(inspection, true);
  }

  public async completeInspection(idInspection: string): Promise<boolean> {
    const uploadWasSuccessful = await this.uploader.uploadInspection(idInspection);
    const inspection = await this.getInspection(idInspection);
    inspection.currentVisit.status = this.inspectionVisitStatusEnum.Completed;
    inspection.currentVisit.endedOn = new Date();
    inspection.status = this.inspectionStatusEnum.WaitingForApprobation;

    const savingWasSuccessful = await this.saveInspectionAndVisit(inspection, uploadWasSuccessful);
    if (savingWasSuccessful && uploadWasSuccessful) {
      await this.synchronizer.deleteInspectionFromCache(idInspection);
      return true;
    } else {
      return false;
    }
  }

  public async uploadInspection(idInspection: string): Promise<boolean> {
    if (this.uploader.uploadInspection(idInspection)) {
      await this.synchronizer.deleteInspectionFromCache(idInspection);
      return true;
    } else {
      return false;
    }
  }

  private async saveInspectionAndVisit(inspection, sendToApi: boolean): Promise<boolean> {
    if (sendToApi) {
      return this.http.post('Inspection', inspection).toPromise<boolean>().then(
        async (success) => {
          inspection.hasBeenModified = !success;
          inspection.currentVisit.hasBeenModified = !success;
          await this.save(inspection);
          return success;
        },
        async () => {
          await this.saveInspectionToCache(inspection);
          return false;
        }
      );
    } else {
      return this.saveInspectionToCache(inspection);
    }
  }

  private async saveInspectionToCache(inspection): Promise<boolean> {
    inspection.hasBeenModified = true;
    inspection.currentVisit.hasBeenModified = true;
    return this.save(inspection);
  }

  public async hasBeenDownloaded(idInspection: string): Promise<boolean> {
    return (await this.storage.get('inspection_buildings_' + idInspection)) != null;
  }

  public save(inspection: InspectionWithBuildingsList): Promise<boolean> {
    return this.storage.set('inspection_buildings_' + inspection.id, inspection);
  }

  public async saveCurrentInspection(inspection: InspectionWithBuildingsList) {
    const batches = await this.storage.get('batches');
    for (const batch of batches) {
      for (const current of batch.inspections) {
        if (current.id === inspection.id) {
          current.status = inspection.status;
          current.hasBeenDownloaded = true;
          return await this.storage.set('batches', batches);
        }
      }
    }
    return false;
  }

  public CanUserAccessInspection(idInspection: string): Promise<boolean> {
    return this.http.get('inspection/' + idInspection + '/userAllowed')
      .toPromise()
      .then(result => {
          // if we can access the api, we will and use the answer to decide if the user can start the inspection.
          return result;
        },
        () => {
          // If we can't access the api, we consider that the user can start the inspection no matter what.
          return true;
        });
  }
}
