
export interface TestType {
    testId: number;
    beginDate: string;
    endDate: string;
    testName: string;
    intro: string;
    tag: string;
    paperId: number
}


export interface TestDetailType {
    testId: number;
    beginDate: string;
    endDate: string;
    testName: string;
    intro: string;
    tag: string;
    paperId: number;
    userList: number[]; //userIdList
}

