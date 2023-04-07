import { Divider, Progress, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { oneExamQuestions } from "./mockExamData.tsx";
import { oneQuestionAnswer, examPaper } from "./examTypeDefine.tsx";
import axios from "axios";

export interface examDetailsProps {
    id: number;
    setStartExam: (startExam: boolean) => void;
    setEndExam: (endExam: boolean) => void;
}  

const ExamDetail = (props: examDetailsProps) => {

    const [allQuestionAnswer, setAllQuestionAnswer] = useState<oneExamQuestions[]>([]);
    const [submitStatus, setSubmitStatus] = useState<boolean>(false);
    const [examPaperData, setExampaperData] = useState<examPaper>(null);

    const config = {
        headers:{
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6Im1hbmFnZXIiLCJpc3MiOiJzZWN1cml0eSIsImlhdCI6MTY4MDEwMzQ2MiwiYXVkIjoic2VjdXJpdHktYWxsIiwiZXhwIjoxNjgwMTEwNjYyfQ.y-zKf4y5Ip3ySS1kwwtzR7mPm-LCiWrPn2reV5O6Yl8",
        }
      };
      
      const submitHandler = async() => {
        const { data } = await axios.post(`/mytest/answer/1`,config);
        setSubmitStatus(data.success)
        props.setEndExam(true);
        console.log(data);
      }

      useEffect(() => {
        const getExamPaper = async() => {
            const { data } = await axios.get(`/mytest/1`,config);
            setExampaperData(data.result);
            console.log(data)
        }
        getExamPaper();
    },[])

    return(
        // todo
        // 1. 选择试题时选项时将答案添加到 setAllQuestionAnswer 数组里面
        // 2. 提交试卷的接口对好
        // 3. 倒计时做好
        <div className="exam-container">
        <Progress percent={60} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} />
        <h3>{oneExamQuestions.paperName}</h3>
        <Divider />
        <Form 
          style={{marginLeft:'100px',marginRight:'100px',fontSize:'17.5px',textAlign:'left'}}>
            
            {oneExamQuestions.questionList.map((question,index)=>(
                <>
                <Form.Group className="mb-3" controlId="question">
                    <Form.Label>
                        {index+1}. {' '}<b>({question.questionType}){' '}</b>{question.description}
                    </Form.Label>

                    {/* 四个答案竖着排列 */}
                    {question.choice.map((choice,subindex) => (
                        <Form.Check  
                        type="checkbox"
                        id={choice}
                        label={choice}
                        />
                    ))}
                </Form.Group>
                <Divider />
                </>
            ))}
            <Button 
              onClick={()=>{
                props.setStartExam(false);
                props.setEndExam(true);
              }}> 提交试卷
            </Button>
      </Form>
      
      </div>
    );
}

export default ExamDetail;