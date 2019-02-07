import {HttpService} from "../Base/http.service";
import {Observable} from "rxjs/Observable";
import {EventEmitter, Injectable} from "@angular/core";
import {InspectionSurveyAnswer} from "../../models/inspection-survey-answer";
import {InspectionSurveySummaryCategory} from "../../models/inspection-survey-summary-category";
import {Storage as OfflineStorage} from "@ionic/storage";

@Injectable()
export class InspectionSurveyAnswerRepositoryProvider {

    public questionAnswered: EventEmitter<any> = new EventEmitter<any>();

    constructor(
      private http: HttpService,
      private storage: OfflineStorage) {
    }

    /*public answerQuestion(inspectionSurveyAnswer: InspectionSurveyAnswer): Observable<any> {
        if (!inspectionSurveyAnswer)
            return Observable.of('');
        else {
            return this.http.post('InspectionSurveyAnswer/Answer', JSON.stringify(inspectionSurveyAnswer));
        }
    }*/

    public getQuestionList(idInspection: string): Promise<InspectionSurveyAnswer[]> {
      return this.storage.get('inspection_survey_questions_' + idInspection);
    }

    public async getAnswerList(idInspection: string): Promise<InspectionSurveyAnswer[]> {
        let answers = await this.storage.get('inspection_survey_answers_' + idInspection);
        return answers || [];
        // return this.http.get('InspectionSurveyAnswer/Inspection/' + idInspection + '/Answer');
    }

    public async saveAnswers(idInspection: string, answers: InspectionSurveyAnswer[]): Promise<boolean> {
      return this.storage.set('inspection_survey_answers_' + idInspection, answers);
    }

    public getAnswerSummaryList(idInspection: string): Observable<InspectionSurveySummaryCategory[]> {
        return this.http.get('InspectionSurveyAnswer/Inspection/' + idInspection + '/Summary');
    }

    /*public setSurveyStatus(idInspection: string, isSurveyCompleted: boolean = true): Promise<any> {
        if (!idInspection)
            return '';
        else {
            //return this.http.post('InspectionSurveyAnswer/SetSurveyStatus', {idInspection:idInspection,isCompleted:isSurveyCompleted});

        }
    }*/

    /*public deleteSurveyAnswers(AnswerIdList: string[]): Observable<any>{
        return this.http.put('InspectionSurveyAnswer/Inspection/DeleteAnswers', AnswerIdList);
    }*/
}
