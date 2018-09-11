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
    sequence: number;
    idSurveyQuestionParent: string;

    childSurveyAnswerList: InspectionSurveyAnswer[];
    choicesList: InspectionSurveyAnswerChoice[];
}

export enum SurveyQuestionTypeEnum {
    choiceAnswer = 1,
    textAnswer = 2,
    dateAnswer = 3,
    groupedQuestion = 4
}