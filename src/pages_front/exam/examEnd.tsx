import { Button, Result } from "antd";
import React from "react";

export interface examEndProps {
    setEndExam: (endExam: boolean) => void;
    setExamAnswerCheck: (chekckExam: boolean) => void;
}  


const ExamEnd = ( props:examEndProps ) => {
    return(
        <Result
        status="success"
        title="恭喜你答题结束!你的分数为：100分"
        subTitle="现在你可以点击下方按钮查看正确答案。"
        extra={[
          <Button  key="console">
            确认
          </Button>,
          <Button type="primary" onClick={()=>{
            props.setEndExam(false);
            props.setExamAnswerCheck(true);
          }}>查看答案解析</Button>,
        ]}
      />
    );
}
export default ExamEnd;