export type examQuestion = {
    questionId: number;
    choice: string[];
    score: number;
    description: string;
    questionType: string;
}

export type examPaper = {
    paperId: number;
    paperName: string;
    score: number;
    questionList: examQuestion[]; 
}

export type oneQuestionAnswer = {
    questionId: number;
    ans: string;
    score: number;
}