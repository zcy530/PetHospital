//展示在表格的TestInfoType
export interface TestType {
    testId: number;
    beginDate: string;
    endDate: string;
    testName: string;
    intro: string;
    tag: string;
    paperId: number
}

interface Student {
    userId: number,
    email: string
}

//用于新增考试场次的
export interface TestDetailType {
    testId: number;
    beginDate: string;
    endDate: string;
    testName: string;
    intro: string;
    tag: string;
    paperId: number;
    userList: Student[]; //userIdList
}

