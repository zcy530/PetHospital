export type examList = {
    testId: number;
    testName: string;
    intro: string;
    tag: string;
    beginDate: string;
    endDate: string;
}

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
    score: string;
}

export type oneQuestionStandardAnswer = {

    questionId: number;
    choice:string;
    choiceList: string[];
    score: number;
    description: string;
    questionType: string;
    userAns: string;
    ans: string;
    getScore: number;
}