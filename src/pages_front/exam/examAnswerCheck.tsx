import { Divider, Progress, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";
import { oneQuestionStandardAnswer, examPaper } from "./examTypeDefine.tsx";
import axios from "axios";
import { mytoken } from "../token.js";
import { useSelector } from "react-redux";


export interface examAnswerCheckProps {
    id: number;
    setCheckExamAnswer: (checkExam: boolean) => void;
}  

const ExamAnswerCheck = (props: examAnswerCheckProps) => {

    const userLogin = useSelector((state:any) => state.userLogin)
    const { userInfo } = userLogin
  
    const initial_answer: oneQuestionStandardAnswer = {
        questionId: 0,
        choice: "",
        choiceList: [],
        score: 0,
        description: "",
        questionType: "",
        userAns: "",
        ans: "",
        getScore: 0,
    }

    const initial_paperAnswer: oneQuestionStandardAnswer[]= []

    const [paperName, setPaperName] = useState<string>('');
    const [examPaperAnswer, setExamPaperAnswer] = useState<oneQuestionStandardAnswer[]>(initial_paperAnswer);

    const config = {
        headers:{
          "Authorization": userInfo.data.result.token,
        }
      };
    


    useEffect(() => {
        const getExamAnswer = async() => {
            const { data } = await axios.get(`https://47.120.14.174:443/petHospital/mytest/record/1`,config);
            setExamPaperAnswer(data.result);
            console.log(data.result)
        }

        const getPaperName = async(id: number) => {
            const { data } = await axios.get(`https://47.120.14.174:443/petHospital/mytest/1`,config);
            setPaperName(data.result.paperName);
        }
        getExamAnswer();
        getPaperName(1);
    },[props.id])

    return(
        // todo
        // 1. 选择试题时选项时将答案添加到 setAllQuestionAnswer 数组里面
        // 2. 提交试卷的接口对好
        // 3. 倒计时做好
        <div className="exam-container">
        <h3>{paperName}</h3>
        <Divider />
        <Form 
          style={{marginLeft:'130px',marginRight:'100px',fontSize:'18px',textAlign:'left'}}>
            
            {examPaperAnswer.map((question,index)=>(
                <>
                <Form.Group className="mb-3" controlId="question">
                    <Form.Label>
                        <b>{index+1}. {' '}({question.questionType}){' '}{question.description}</b>
                    </Form.Label>
                    <Form.Label>
                        <b style={{marginLeft:'20px'}}>{'（'}得分:{' '}{question.getScore}{'/'}{question.score}{'）'}</b>
                    </Form.Label>
                    <br />
                    <Form.Label>
                        <b style={{color:'green'}}>正确答案:{' '}{question.ans}</b>
                    </Form.Label>
                    <br />
                    <Form.Label>
                        <b style={{color:'blue'}}>你的答案:</b>
                    </Form.Label>
                    {/* 四个答案竖着排列 */}
                    {question.choiceList.map((choice,subindex) => (
                        <Form.Check  
                        type="checkbox"
                        id={choice}
                        label={choice}
                        defaultChecked={!(question.userAns==choice)}
                        disabled={true}
                        >
                        </Form.Check>
                    ))}
                    
                </Form.Group>
                <Divider />
                </>
            ))}
            <Button 
              onClick={()=>{
                props.setCheckExamAnswer(false);
              }}> 返回首页
            </Button>
      </Form>
      
      </div>
    );
}

export default ExamAnswerCheck;