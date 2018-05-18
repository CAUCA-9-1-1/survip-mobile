export class InspectionQuestionSummary {
    id: string;
    questionTitle: string;
    questionDescription: string;
    answer: string;
    questionType: number;
    sequence: number;
    isRecursive: boolean;

    recursiveAnswer: InspectionQuestionSummary[];
}