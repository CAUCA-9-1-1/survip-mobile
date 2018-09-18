export class InspectionSurveySummary {
    id: string;
    questionTitle: string;
    questionDescription: string;
    answer: string;
    questionType: number;
    sequence: number;
    isRecursive: boolean;

    childSurveyAnswerList: InspectionSurveySummary[];
}