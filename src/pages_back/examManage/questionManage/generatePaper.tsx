import React, { FC, useEffect, useLayoutEffect, useState } from 'react'
import { Divider, InputNumber, List } from "antd";
import {
    Form,
    Input,
    Button,
    Space,
} from 'antd';
import { useLocation } from 'react-router-dom';
import BackButton from '../../global/backButton.tsx';


interface QuestionDetail {
    questionId: number,
    questionType: string,
    description: string,
    choice: string[],
}

//传入参数：questionIdList: number[]
const GeneratePaper = () => {


    //使用钩子获取state
    const { state } = useLocation();
    console.log(state.questionList)

    const [questions, setQuestions] = useState<QuestionDetail[]>([]);

    useEffect(() => {
        let questionList: QuestionDetail[] = [];
        //遍历questionlist
        state.questionList.map(id => {
            let question: QuestionDetail = {
                questionId: 0,
                questionType: '',
                description: '',
                choice: []
            };
            //获取题目详情
            fetch("http://localhost:8080/petHospital/questions/" + id)
                .then(
                    (response) => response.json(),
                )
                .then((data) => {
                    console.log(data.result);
                    let res = data.result;
                    //赋值给questions:list
                    question.choice = res.choice;
                    question.questionId = res.questionId;
                    question.questionType = res.questionType;
                    question.description = res.description;
                    console.log(question)
                    questionList.push(question)
                })
                .catch((err) => {
                    console.log(err.message);
                });
        })
        setTimeout(() => {
            setQuestions(questionList);
        }, 0);
        // form.setFieldValue("paperName", questions[0].description)
    }, []);

    //试卷名字、试题列表、总分值（自动计算） Form

    const [score, setScore] = useState(0);

    const countScore = (e) => {
        console.log(e)
        setScore(score + e) //设置分值 显示在下
    }

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
        //todo: 上传到post
    };


    return (
        <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
            <BackButton />
            {questions ? (<>
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    style={{ maxWidth: '100%', marginLeft: 100, }}
                >
                    <Form.Item label="试卷名称" name="paperName"
                        rules={[{ required: true, message: 'Paper name is required' }]}>
                        <Input size='large' placeholder='请填写试卷名称' />
                    </Form.Item>

                    {/* 四个选项竖着排列 */}
                    <Form.Item label='题目列表' name="questionList">
                        {questions.map((question, index) => (
                            <Form.Item >
                                {/* <Space >
                                        <span style={{ fontSize: '16px' }}>
                                            {index + 1}.{' '}<b>({question.questionType}){' '}</b>{question.description}
                                        </span>
                                        <InputNumber prefix="分值：" name="sub-score" style={{ width: '50%' }} onChange={countScore}></InputNumber>
                                    </Space> */}

                                {/* 四个答案竖着排列 */}
                                {/* <List
                                        style={{ margin: '16px' }}
                                        bordered
                                        dataSource={question.choice}
                                        renderItem={(item) => <List.Item>{item}</List.Item>}
                                    />
                                    <Divider></Divider> */}

                                <Space >
                                    <span style={{ fontSize: '16px' }}>
                                        {index + 1}.{' '}<b>({question.questionType}){' '}</b>{question.description}
                                    </span>
                                    <InputNumber />
                                </Space>

                                {/* 四个答案竖着排列 */}
                                <List
                                    style={{ margin: '16px' }}
                                    bordered
                                    dataSource={question.choice}
                                    renderItem={(item) => <List.Item style={{ color: 'steelblue' }}>{item}</List.Item>}
                                />
                                {/* <Divider></Divider> */}
                            </Form.Item>
                        ))}
                    </Form.Item>


                    <Form.Item label="试卷总分" name="score" >
                        <InputNumber />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            生成
                        </Button>
                    </Form.Item>
                </Form >

            </>) : (<>正在加载中</>)}

        </div>




    )
}


export default GeneratePaper;
