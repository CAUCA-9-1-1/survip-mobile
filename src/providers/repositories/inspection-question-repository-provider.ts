import {HttpService} from "../Base/http.service";
import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {InspectionQuestion} from "../../models/inspection-question";

@Injectable()
export class InspectionQuestionRepositoryProvider {

    constructor(private http: HttpService) {}

    public answerQuestion(inspectionQuestion: InspectionQuestion): Observable<any>
    {
        if(!inspectionQuestion)
            return Observable.of('');
        else {
            return this.http.post('InspectionQuestion/Answer',JSON.stringify(inspectionQuestion))
                .pipe(map(response => response));
        }
    }

    public getList(idInspection : string): Observable<InspectionQuestion[]>{
        return this.http.get('InspectionQuestion/Inspection/' + idInspection)
            .pipe(map(response => response));
    }
}