import React, { useEffect, useRef, useState } from 'react';
import { InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Select,
    Upload,
    Space,
    Modal,
    Table,
    Layout,
    message,
    InputNumber,
    List,
    Divider,
} from 'antd';
import { useForm } from 'antd/es/form/Form';

//返回给上层表单的类型
interface returnType {
    questionId: number,
    score: number
}



// 根据传来的id，展示题目详情（List），设置分数(inputnumber)


const QuestionList = (props) => {
    //父组件传来 question列表
    const questions = props.questions;
    const [form] = Form.useForm();
    console.log(questions)

    const countScore = (e) => {
        console.log("score changed:" + e)
        // props.getQuestionList()
        // form.setFieldValue()
    }

    const submitQuestions = () => {
        let values = form.getFieldsValue();
        console.log('Received values of form:', values);
    }

    const onFinish = (values: any) => {

        console.log('Received values of form:', values);
        //todo: 上传到post
    };

    const [subScore, setSubScore] = useState(0);


    return (
        <Form
            form={form}
            onFinish={onFinish}>
            <Form.Item name="question">
                {questions.map((question, index) => (
                    <>
                        <Form.Item name={"questionId"}>
                            <span style={{ fontSize: '16px' }}>
                                {index + 1}.{' '}<b>({question.questionType}){' '}</b>{question.description}
                            </span>
                        </Form.Item>
                        <List
                            size='small'
                            style={{ margin: '16px' }}
                            bordered
                            dataSource={question.choice}
                            renderItem={(item) => <List.Item style={{ color: 'steelblue' }}>{item}</List.Item>}
                        />
                        <InputNumber key={index} min='0' max='100' style={{ width: '50%' }} prefix="分值："
                            onChange={countScore}
                        ></InputNumber>


                        <Form.Item key={index} name={["score"]}>
                            <InputNumber key={index} value={question.questionId} min='0' max='100' style={{ width: '50%' }} prefix="分值："
                                onChange={countScore}
                            ></InputNumber>
                        </Form.Item>
                    </>
                ))
                }
            </Form.Item >
            <Form.List name="questionList">
                {(quesitons) => (
                    <>
                        {questions.map(({ question, index }) => (
                            <Space key={index} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    key={index}
                                    name={['choice']}
                                >
                                    <Input key={index} placeholder="选项" />
                                </Form.Item>
                            </Space>
                        ))}
                    </>
                )}
            </Form.List>

            <Form.Item style={{ textAlign: 'center' }}>
                <Button type="primary" ghost onClick={submitQuestions}>
                    确认
                </Button>
            </Form.Item>
        </Form >
    )
}

export default QuestionList;

