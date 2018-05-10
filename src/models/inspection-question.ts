import {InspectionQuestionChoice} from "./inspection-question-choice";

export class InspectionQuestion {
    id: string;
    idInspection: string;
    idSurveyQuestion: string;
    idSurveyQuestionChoice: string;
    questionType: number;
    answer: string;
    title: string;
    description: string;
    sequence: number

    choicesList: InspectionQuestionChoice[];
}