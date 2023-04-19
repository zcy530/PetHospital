export interface PaperType {
    paperId: number,
    paperName: string,
    score: number
}

export interface Question {
    questionId: number,
    choice: string,
    score: number,
    description: string,
    questionType: string
}

export interface PaperDetailType {
    paperId: number,
    paperName: string,
    score: number,
    questionList: Question[]
}