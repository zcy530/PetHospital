import React, { useState } from 'react'
import { Divider, InputNumber, List } from "antd";
import {
    Form,
    Input,
    Button,
    Space,
} from 'antd';
// import {  Col, Container, Form, Input, } from "react-bootstrap";

const questionList = [
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

//传入参数：questionIdList: number[]
const GeneratePaper = (props: number[]) => {
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
            {/* <Divider></Divider> */}
            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: '100%', marginLeft: 100, }}
            >
                <Form.Item label="试卷名称"
                    rules={[{ required: true, message: 'Paper name is required' }]}>
                    <Input size='large' placeholder='请填写试卷名称' />
                </Form.Item>
                {/* 四个选项竖着排列 */}
                <Form.Item label='题目列表'>
                    {questionList.map((question, index) => (
                        <Form.Item >
                            <Space >
                                <span style={{ fontSize: '16px' }}>
                                    {index + 1}.{' '}<b>({question.questionType}){' '}</b>{question.description}
                                </span>
                                <InputNumber prefix="分值：" style={{ width: '50%' }}  onChange={countScore}></InputNumber>
                            </Space>

                            {/* 四个答案竖着排列 */}
                            <List
                                style={{ margin: '16px' }}
                                bordered
                                dataSource={question.choice}
                                renderItem={(item) => <List.Item>{item}</List.Item>}
                            />
                            <Divider></Divider>
                        </Form.Item>
                    ))}
                </Form.Item>


                <Form.Item label="试卷总分" >
                    <span style={{ fontSize: '18px' }}>{score}</span>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit">
                        生成
                    </Button>
                </Form.Item>
            </Form >
        </div >

    )
}


export default GeneratePaper;
