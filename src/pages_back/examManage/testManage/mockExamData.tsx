import { examPaper } from "./examTypeDefine.tsx";

export const oneExamQuestions : examPaper = {
    "paperId": 1,
    "paperName": "肠胃病考试试卷",
    "score": 100,
    "questionList": [
        {
            "questionId": 1,
            "choice": [
                "胆结石",
                "心脏肥大",
                "肠胃炎",
                "胃穿孔"
            ],
            "score": 20,
            "description": "下列不属于肠胃病的是？",
            "questionType": "单选"
        },
        {
            "questionId": 2,
            "choice": [
                "胆结石",
                "心脏肥大",
                "肾衰竭",
                "胃穿孔"
            ],
            "score": 30,
            "description": "下列不属于肠胃病的是？",
            "questionType": "多选"
        },
        {
            "questionId": 3,
            "choice": [
                "对",
                "错"
            ],
            "score": 30,
            "description": "心脏肥大不属于肠胃病",
            "questionType": "判断"
        }
    ]
  }