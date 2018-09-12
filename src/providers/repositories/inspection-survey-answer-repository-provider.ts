import {HttpService} from "../Base/http.service";
import {Observable} from "rxjs/Observable";
import {EventEmitter, Injectable} from "@angular/core";
import {InspectionSurveyAnswer} from "../../models/inspection-survey-answer";
import {InspectionSurveySummaryCategory} from "../../models/inspection-survey-summary-category";

@Injectable()
export class InspectionSurveyAnswerRepositoryProvider {

    public questionAnswered: EventEmitter<any> = new EventEmitter<any>();

    constructor(private http: HttpService) {
    }

    public answerQuestion(inspectionSurveyAnswer: InspectionSurveyAnswer): Observable<any> {
        if (!inspectionSurveyAnswer)
            return Observable.of('');
        else {
            return this.http.post('InspectionSurveyAnswer/Answer', JSON.stringify(inspectionSurveyAnswer));
        }
    }

    public getQuestionList(idInspection: string): Observable<InspectionSurveyAnswer[]> {
        return this.http.get('InspectionSurveyAnswer/Inspection/' + idInspection + '/Question');
    }

    public getAnswerList(idInspection: string): Observable<InspectionSurveyAnswer[]> {
        return this.http.get('InspectionSurveyAnswer/Inspection/' + idInspection + '/Answer');
    }

    public getAnswerSummaryList(idInspection: string): Observable<InspectionSurveySummaryCategory[]> {
        return this.http.get('InspectionSurveyAnswer/Inspection/' + idInspection + '/Summary');
    }

    public CompleteSurvey(idInspection: string): Observable<any> {
        if (!idInspection)
            return Observable.of('');
        else {
            return this.http.post('InspectionSurveyAnswer/CompleteSurvey', JSON.stringify(idInspection));
        }
    }

    public deleteSurveyAnswers(AnswerList: InspectionSurveyAnswer[]): Observable<any>{
        let Ids = [];
        AnswerList.forEach(answer=>{
           Ids.push(answer.id) ;
        });
        if(Ids.length > 0) {
            return this.http.put('InspectionSurveyAnswer/Inspection/DeleteAnswers', Ids);
        }
    }
}