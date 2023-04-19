import { Divider, Progress, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { oneExamQuestions } from "./mockExamData.tsx";
import { oneQuestionAnswer, examPaper } from "./examTypeDefine.tsx";
import axios from "axios";
import { mytoken } from "../token.js";
import { useSelector } from "react-redux";


export interface examDetailsProps {
    id: number;
    setStartExam: (startExam: boolean) => void;
    setEndExam: (endExam: boolean) => void;
}  

const ExamDetail = (props: examDetailsProps) => {

    const userLogin = useSelector((state:any) => state.userLogin)
    const { userInfo } = userLogin
  
    const initial_answer: oneQuestionAnswer = {
      questionId: 0,
      ans: '',
      score: '',
    } 

    const initial_paper: examPaper = {
      paperId: 1,
      paperName: '',
      score: 0,
      questionList: [], 
  }

    const initial_paperAnswer: oneQuestionAnswer[]= []

    const [allQuestionAnswer, setAllQuestionAnswer] = useState<oneQuestionAnswer[]>(initial_paperAnswer);
    const [thisQuestionAnswer, setThisQuestionAnswer] = useState<oneQuestionAnswer>(initial_answer);
    const [submitStatus, setSubmitStatus] = useState<boolean>(false);
    const [examPaperData, setExampaperData] = useState<examPaper>(initial_paper);

    const config = {
        headers:{
          "Authorization": userInfo.data.result.token,
        }
      };
      
      const submitHandler = async() => {
        const { data } = await axios.post(`https://47.120.14.174:443/petHospital/mytest/answer/1`,config);
        setSubmitStatus(data.success)
        props.setEndExam(true);
        console.log(data);
      }

      useEffect(() => {
        const getExamPaper = async() => {
            const { data } = await axios.get(`https://47.120.14.174:443/petHospital/mytest/${props.id}`,config);
            setExampaperData(data.result);
            console.log(data.result)
        }
        getExamPaper();
    },[props.id])

    return(
        // todo
        // 1. 选择试题时选项时将答案添加到 setAllQuestionAnswer 数组里面
        // 2. 提交试卷的接口对好
        // 3. 倒计时做好
        <div className="exam-container">
        <Progress percent={60} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} />
        <h3>{examPaperData.paperName}</h3>
        <Divider />
        <Form 
          style={{marginLeft:'100px',marginRight:'100px',fontSize:'18px',textAlign:'left'}}>
            
            {examPaperData.questionList.map((question,index)=>(
                <>
                <Form.Group className="mb-3" controlId="question">
                    <Form.Label>
                      <b> {index+1}. {' '}({question.questionType}){' '}{question.description}</b>
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