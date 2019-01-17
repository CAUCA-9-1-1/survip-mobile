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
    idParent: string;
    maxOccurrence = 0;
    minOccurrence = 0;

    childSurveyAnswerList: InspectionSurveyAnswer[];
    choicesList: InspectionSurveyAnswerChoice[];

  isActive: boolean = true;
  hasBeenModified: boolean = false;
};

export enum SurveyQuestionTypeEnum {
    choiceAnswer = 1,
    textAnswer = 2,
    dateAnswer = 3,
    groupedQuestion = 4
};
