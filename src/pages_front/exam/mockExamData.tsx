import { examPaper } from "./examTypeDefine.tsx";

export const examCardData = Array.from({ length: 23 }).map((_, i) => ({
    title: `测试题目 ${i}`,
    avatar: `https://joesch.moe/api/v1/random?key=${i}`,
    description: '考试时间：2022.5.30 19:00-20:00',
    content: '全国执业兽医资格考试分为基础、预防、临床和综合应用4门科目，报考人员可以选择报考全部4门科目，也可以选择报考部分科目',
  }));

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
  