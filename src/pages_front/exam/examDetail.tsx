import { Divider, Progress, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { oneExamQuestions } from "./mockExamData.tsx";
import { oneQuestionAnswer, examPaper } from "./examTypeDefine.tsx";
import axios from "axios";
import { useSelector } from "react-redux";
import FundClockProgress from "react-fundraising-countdown"
import moment from 'moment'


export interface examDetailsProps {
    id: number;
    setStartExam: (startExam: boolean) => void;
    setEndExam: (endExam: boolean) => void;
}  

const ExamDetail = (props: examDetailsProps) => {

    const userLogin = useSelector((state:any) => state.userLogin)
    const { userInfo } = userLogin
  
    // 试卷题目初始化
    const initial_paper: examPaper = {
      paperId: 1,
      paperName: '',
      score: 0,
      questionList: [], 
    }

    // 每个题目的答案初始化
    const initial_answer: oneQuestionAnswer = {
      questionId: 0,
      ans: '',
      score: '',
    } 

    // 所有答案的集合初始化
    const initial_paperAnswer: oneQuestionAnswer[]= []

    // 整套试卷题目的数据
    const [examPaperData, setExampaperData] = useState<examPaper>(initial_paper);
    // 单个题目的答案
    const [thisQuestionAnswer, setThisQuestionAnswer] = useState<oneQuestionAnswer>(initial_answer);
    // 所有题目的答案的集合
    const [allQuestionAnswer, setAllQuestionAnswer] = useState<oneQuestionAnswer[]>(initial_paperAnswer);
    const [submitStatus, setSubmitStatus] = useState<boolean>(false);
    

    const config = {
        headers:{
          "Authorization": userInfo.data.result.token,
        }
      };
      
      const submitHandler = async() => {
        const { data } = await axios.post(`https://47.120.14.174:443/petHospital/mytest/answer/${props.id}`,config);
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
         <h2>{examPaperData.paperName}</h2>
        <div style={{marginLeft:"350px",marginBottom:'20px',marginTop:'30px'}} >
        <FundClockProgress 
          campaignEndDate={moment().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss')} 
          icoClockStyle={{ backgroundColor: "#fff" }}
          icoClockFlipStyle={{ backgroundColor: "#aec5da" }}
          icoClockFlipTextStyle={{ color: "#000" }}
          unitLabelContainerStyle={{ backgroundColor: "#fff" }}
          unitLabelTextStyle={{ color: "#000", fontSize: "1.1em" }}
        />
        </div>
        <Divider />
        <Form 
          style={{marginLeft:'100px',marginRight:'100px',fontSize:'18px',textAlign:'left'}}>
            
            {examPaperData.questionList.map((question,index)=>(
                <>
                <Form.Group className="mb-3" controlId="question">
                    <Form.Label>
                      <b> {index+1}. {' '}({question.questionType}){' '}{question.description}</b>
                    </Form.Label>
                    <Form.Label>
                        <b style={{marginLeft:'10px'}}>{'（'}分数:{' '}{question.score}{'）'}</b>
                    </Form.Label>
                    {/* 四个答案竖着排列 */}
                    {question.choice.map((choice,subindex) => (
                      <Form.Check  
                        type="checkbox"
                        onChange={() => {
                          setThisQuestionAnswer({questionId:question.questionId, ans:choice, score:question.score.toString()});
                          console.log(thisQuestionAnswer)
                          setAllQuestionAnswer((allQuestionAnswer || []).concat([thisQuestionAnswer]));
                          console.log(allQuestionAnswer)
                        }}
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