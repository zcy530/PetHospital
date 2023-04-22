import { Checkbox, Divider, Form } from "antd";
import React, { useEffect, useState } from "react";
import { Button} from "react-bootstrap";
import { oneQuestionAnswer, examPaper } from "./examTypeDefine.tsx";
import axios from "axios";
import { useSelector } from "react-redux";
import FundClockProgress from "react-fundraising-countdown"
import moment from 'moment'
import { CheckboxValueType } from "antd/es/checkbox/Group.js";


export interface examDetailsProps {
    id: number;
    setStartExam: (startExam: boolean) => void;
    setEndExam: (endExam: boolean) => void;
}  

const ExamDetail = (props: examDetailsProps) => {

  const [form] = Form.useForm();
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
        },
        body: allQuestionAnswer,
      };
      
      const submitHandler = async() => {
        
        props.setStartExam(false);
        props.setEndExam(true);

        const { data } = await axios.post(`https://47.120.14.174:443/petHospital/mytest/answer/${props.id}`,config);
        setSubmitStatus(data.success)
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
        // 1. allQuestionAnswer 如何将数组去重
        // 2. 侧边栏的筛选
        // 3. 倒计时结束自动提交
        <div className="exam-container">
         <h2>{examPaperData.paperName}</h2>
        <div style={{margin:"auto",marginBottom:'20px',marginTop:'30px',width:'350px'}} >
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
          form={form}
          style={{marginLeft:'100px',marginRight:'100px',fontSize:'18px',textAlign:'left'}}>
            
            {examPaperData.questionList.map((question,index)=>(
              <>
                <Form.Item label={question.description} ></Form.Item>
                <Checkbox.Group 
                  options={question.choice} 
                  onChange={(checkedValues: CheckboxValueType[])=> {
                    const myans = checkedValues.join(';')
                    
                    console.log(myans)
                      setThisQuestionAnswer(
                        {questionId:question.questionId, 
                         ans:myans, 
                         score:question.score.toString()
                        });
                    
                    // console.log(thisQuestionAnswer.ans)
                    const index = (allQuestionAnswer).findIndex(item => item.questionId == thisQuestionAnswer.questionId);
                    if(index == -1) {
                      setAllQuestionAnswer((allQuestionAnswer||[]).concat([thisQuestionAnswer]));
                    } else {
                      (allQuestionAnswer||[]).splice(index,1,thisQuestionAnswer);
                    }
                    
                    // console.log(allQuestionAnswer)
                  }} 
                  style={{fontSize:'30px'}} />
                <Divider />
              </>
            ))}
            <Button 
              onClick={()=>{
                setAllQuestionAnswer( ((allQuestionAnswer || []).filter(item => item.questionId !== 0)));
                submitHandler();
                console.log(allQuestionAnswer)
                

              }}> 提交试卷
            </Button>
      </Form>
      
      </div>
    );
}

export default ExamDetail;