import { DiseaseInfo } from '../../diseaseManage/diseaseType.tsx'


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
    diseaseName: string;
}

