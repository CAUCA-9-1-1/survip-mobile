import {HttpService} from "../Base/http.service";
import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {InspectionQuestion} from "../../models/inspection-question";
import {HttpErrorResponse} from "@angular/common/http";

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

    public getQuestionList(idInspection : string): Observable<InspectionQuestion[]>{
        return this.http.get('InspectionQuestion/Question/' + idInspection)
            .pipe(map(response => response));
    }

    public getAnswerList(idInspection : string): Observable<InspectionQuestion[]>{
        return this.http.get('InspectionQuestion/Answer/' + idInspection)
            .pipe(map(response => response));
    }

    public CompleteSurvey(idInspection: string): Observable<any>
    {
        if(!idInspection)
            return Observable.of('');
        else {
            return this.http.post('InspectionQuestion/CompleteSurvey', JSON.stringify(idInspection));
        }
    }
}