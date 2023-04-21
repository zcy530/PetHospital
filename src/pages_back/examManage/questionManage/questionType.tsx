//考题的数据类型
export interface QuestionType {
    key: React.Key;
    questionId: number;
    keyword: string;
    diseaseName: string;
    description: string;
    questionType: string;
}


//考题详情
export interface QuestionDetailType {
    questionId: number;
    questionType: string;
    description: string;
    choice: string[];
    ans: string[];
    keyword: string;
    diseaseName: {"diseaseId":0, "diseaseName": ''};
}

export interface QuestionDetail {
    questionId: number,
    questionType: string,
    description: string,
    choice: string[],
    ans: string,
    keyword: string,
}

export interface PostQuestion {
    questionId: number,
    score: number
}


//用于增添考题的类型
export interface Question {
    questionId: number,
    choice: string,
    score: number,
    description: string,
    questionType: string
}
