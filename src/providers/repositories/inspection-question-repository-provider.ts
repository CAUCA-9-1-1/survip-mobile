import {HttpService} from "../Base/http.service";
import {Observable} from "rxjs/Observable";
import {Injectable} from "@angular/core";
import {InspectionQuestion} from "../../models/inspection-question";
import {InspectionQuestionSummaryCategory} from "../../models/inspection-question-summary-category";

@Injectable()
export class InspectionQuestionRepositoryProvider {

    constructor(private http: HttpService) {
    }

    answerQuestion(inspectionQuestion: InspectionQuestion): Observable<any> {
        if (!inspectionQuestion)
            return Observable.of('');
        else {
            return this.http.post('InspectionQuestion/Answer', JSON.stringify(inspectionQuestion));
        }
    }

    getQuestionList(idInspection: string): Observable<InspectionQuestion[]> {
        return this.http.get('InspectionQuestion/Inspection/' + idInspection + '/Question');
    }

    getAnswerList(idInspection: string): Observable<InspectionQuestion[]> {
        return this.http.get('InspectionQuestion/Inspection/' + idInspection + '/Answer');
    }

    getAnswerSummaryList(idInspection: string): Observable<InspectionQuestionSummaryCategory[]> {
        return this.http.get('InspectionQuestion/Inspection/' + idInspection + '/Summary');
    }

    CompleteSurvey(idInspection: string): Observable<any> {
        if (!idInspection)
            return Observable.of('');
        else {
            return this.http.post('InspectionQuestion/CompleteSurvey', JSON.stringify(idInspection));
        }
    }
}