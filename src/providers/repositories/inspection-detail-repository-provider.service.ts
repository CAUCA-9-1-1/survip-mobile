import {Injectable} from '@angular/core';
import {HttpService} from '../Base/http.service';
import {Observable} from 'rxjs/Observable';
//import {InspectionDetail} from '../../models/inspection-detail';
import {InspectionVisit} from "../../models/inspection-visit";
import {TranslateService} from "@ngx-translate/core";
import {BuildingDetailRepositoryProvider} from "./building-detail-repository";

@Injectable()
export class InspectionDetailRepositoryProvider {

    public labels = {};
    public InspectionStatusEnum = {
        'Todo': 0,
        'Started': 1,
        'WaitingForApprobation': 2,
        'Approved': 3,
        'Refused': 4,
        'Canceled': 5
    };
    public InspectionVisitStatusEnum = {'Todo': 0, 'Started': 1, 'Completed': 2};

    constructor(
      private http: HttpService,
      private detailRepo: BuildingDetailRepositoryProvider,
      private translateService: TranslateService) {
        this.translateService.get([
            'generalInformation', 'Buildings', 'waterSupplies', 'implantationPlan', 'course',
            'inspectionStatusTodo', 'inspectionStatusStarted', 'inspectionStatusWaitingForApprobation', 'inspectionStatusApproved',
            'inspectionStatusRefused', 'inspectionStatusCanceled', 'visitStatusTodo', 'visitStatusStarted',
            'visitStatusCompleted'
        ]).subscribe(labels => {
                this.labels = labels;
            },
            error => {
                console.log(error)
            });
    }

    public async savePicture(idBuilding: string, idPicture: string): Promise<boolean> {
      const detail = await this.detailRepo.get(idBuilding);
      detail.idPicturePlan = idPicture;
      return this.detailRepo.save(detail);
    }

    public startInspection(idInspection: string): Observable<any> {
        return this.http.post('Inspection/StartInspection', JSON.stringify(idInspection));
    }

    public completeInspection(idInspection: string): Observable<any> {
        return this.http.post('Inspection/CompleteInspection', JSON.stringify(idInspection));
    }

    public RefuseInspectionVisit(inspectionVisit: InspectionVisit): Observable<InspectionVisit> {
        return this.http.post('Inspection/RefuseInspectionVisit', JSON.stringify(inspectionVisit));
    }

    public getInspectionStatusText(status: number) {
        return this.labels["inspectionStatus" + Object.keys(this.InspectionStatusEnum).find(e => this.InspectionStatusEnum[e] === status)];
    }

    public getVisitStatusText(status: number) {
        return this.labels["visitStatus" + Object.keys(this.InspectionVisitStatusEnum).find(e => this.InspectionVisitStatusEnum[e] === status)];
    }

    public CanUserAccessInspection(idInspection: string):Promise<boolean>{
        return this.http.get('inspection/' + idInspection + '/userAllowed').toPromise();
    }
}
