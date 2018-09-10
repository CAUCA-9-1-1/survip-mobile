import {InspectionSurveyAnswerChoice} from "./inspection-survey-answer-choice";

export class InspectionSurveyAnswer {
    id: string;
    idInspection: string;
    idSurveyQuestion: string;
    idSurveyQuestionChoice: string;
    questionType: number;
    answer: string;
    title: string;
    description: string;
    idSurveyQuestionNext: string;
    sequence: number

    choicesList: InspectionSurveyAnswerChoice[];
}