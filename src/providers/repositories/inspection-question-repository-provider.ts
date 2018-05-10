import {HttpService} from "../Base/http.service";
import {Observable} from "rxjs/Observable";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {InspectionQuestion} from "../../models/inspection-question";

@Injectable()
export class InspectionQuestionRepositoryProvider {

    constructor(private http: HttpService) {}

    public answerQuestion(idSurveyQuestion : string, answer : string): Observable<any>
    {
        if((!idSurveyQuestion)||(!answer))
            return Observable.of('');
        else {
            return this.http.post('InspectionQuestion/SurveyQuestion/' + idSurveyQuestion+'/Answer/'+ answer)
                .pipe(map(response => response));
        }
    }

    public getList(idSurvey : string): Observable<InspectionQuestion[]>{
        return this.http.get('InspectionQuestion/Survey/' + idSurvey)
            .pipe(map(response => response));
    }
}