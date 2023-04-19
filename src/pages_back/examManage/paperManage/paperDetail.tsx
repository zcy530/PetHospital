import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined, TagTwoTone, LeftCircleTwoTone, LeftOutlined, FileTextTwoTone } from '@ant-design/icons';
import { Form, Space, List, Divider, Input } from 'antd';
import BackButton from '../../global/backButton.tsx';
import { PaperDetailType } from './paperType.tsx';

const PaperDetail = () => {
    const params = useParams();
    const [form] = Form.useForm();
    const [paperDetail, setPaperDetail] = useState<PaperDetailType>({
        "paperId": 1,
        "paperName": "",
        "score": 100,
        "questionList": [
            {
                "questionId": 0,
                "choice": "",
                "score": 0,
                "description": "",
                "questionType": ""
            }
        ]
    });

    useEffect(() => {
        let detail: PaperDetailType = {
            paperId: 0,
            paperName: '',
            score: 0,
            questionList: []
        };
        //获取后台数据
        fetch(`https://47.120.14.174:443/petHospital/papers/${params.paper_id}?front=false`)
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                detail = data.result;
                //setTimeout是异步的，但放在定时器里的setState是同步的 带动state会立即更新
                setTimeout(() => {
                    setPaperDetail(detail);
                    console.log(paperDetail);
                }, 0);
                form.setFieldValue("paperName", detail.paperName);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
            <BackButton />
            <Form
                form = {form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: '100%', marginLeft: 100, fontSize: '16px' }}
            // style={{ maxWidth: 600 }}
            >
                <Form.Item label="试卷名称" name = "paperName">
                    <Input size = 'large'  readOnly = {true} prefix ={<FileTextTwoTone />}></Input>
                </Form.Item>

                <Form.Item label="题目列表">
                    {paperDetail.questionList.map((question, index) => (
                        <Form.Item >
                            <Space >
                                <span style={{ fontSize: '16px' }}>
                                    {index + 1}.{' '}<b>({question.questionType}){' '}</b>{question.description}
                                </span>
                                <span style={{ fontSize: '16px', color: 'navy', padding: '5px' }}>
                                    分值： {question.score}
                                </span>
                            </Space>

                            {/* 四个答案竖着排列 */}
                            <List
                                size='small'
                                style={{ margin: '16px' }}
                                bordered
                                dataSource={question.choice.split(";")}
                                renderItem={(item) => <List.Item style={{ color: 'steelblue' }}>{item}</List.Item>}
                            />
                            <Divider></Divider>
                        </Form.Item>
                    ))}
                </Form.Item>

                <Form.Item label="总分" >
                    <span style={{ fontSize: '20px', color: 'firebrick' }}>
                        {paperDetail.score} 分
                    </span>
                </Form.Item>

            </Form>
        </div >

    )

}

export default PaperDetail;