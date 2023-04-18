//修改试卷的界面，可以修改试卷名字和各题的分值

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FileTextTwoTone } from '@ant-design/icons';
import { Form, Space, List, Divider, Input, InputNumber, Button, message } from 'antd';
import BackButton from '../../global/backButton.tsx';
import { PostQuestion } from '../questionManage/questionType.tsx';

interface Question {
    questionId: number,
    choice: string,
    // choiceList: string[],
    score: number,
    description: string,
    questionType: string
}

interface PaperDetailType {
    paperId: number,
    paperName: string,
    score: number,
    questionList: Question[]
}


const PaperUpdate = () => {
    const params = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate(); //跳转路由

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

    const [post, setPost] = useState<PostQuestion[]>([]);
    const [count, setCount] = useState(0); //用于监听变化

    useEffect(() => {
        if (count === 0) { //分数无变化 渲染一次即可
            let detail: PaperDetailType = {
                paperId: 0,
                paperName: '',
                score: 0,
                questionList: []
            };
            //获取后台数据
            fetch(`http://localhost:8080/petHospital/papers/${params.paper_id}?front=false`)
                .then(
                    (response) => response.json(),
                )
                .then((data) => {
                    console.log(data.result);
                    detail = data.result;
                    setPaperDetail(detail);
                    //获取到试卷的detail。给form的各项赋值
                    form.setFieldValue("paperName", detail.paperName); //试卷名
                    form.setFieldValue("score", detail.score); //总分
                    const questionList = detail.questionList;
                    // TODO: 
                    let list: PostQuestion[] = [];
                    for (let i = 0; i < questionList.length; i++) {
                        console.log(questionList[i].score);
                        list.push({ "questionId": questionList[i].questionId, "score": questionList[i].score });
                    }
                    console.log(list)
                    //questionlist赋值
                    form.setFieldValue("questionList", list)
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
        else {
            //监听总分的变化。
            let sum = 0;
            //获取表单中题目列表
            const list = form.getFieldValue("questionList");
            console.log(list)
            list.map(q => {
                console.log('题目'+ q.questionId + '的分数为：' + q.score)
                sum += q.score
            })
            // post.map(record => {
            //     console.log(record.score);
            //     sum += record.score;
            // })
            console.log('总分为：' + sum)
            form.setFieldValue("score", sum);
        }

        console.log(form.getFieldsValue()); //打印表单的值
    }, [count]);

    //更新post的某一格
    const updatePost = (questionId: number, score: number) => {
        let question: PostQuestion = { "questionId": questionId, "score": score };
        let newPost: PostQuestion[] = [...post];
        newPost = newPost.filter(p => { return p.questionId !== questionId })
        newPost.push(question);
        setPost(newPost);
        console.log(newPost)
    }

    //onChange函数 多传一个参数
    const countScore = (_score, question_Id: number,) => {
        console.log(question_Id + "的分数变为：" + _score)
        setCount(count + 1) //用于刷新score数据
    }

    const updatePaper = (values: any) => {
        //todo: 上传到post
        fetch('http://localhost:8080/petHospital/papers/' + params.paper_id, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "paperId": params.paper_id,
                "paperName": values.paperName,
                "questionList": values.questionList, 
                "score": values.score, //总分
            })
        }).then((response) => response.json())
            .then((data) => {
                console.log(data);
                let res = data.success;
                if (res === true) {
                    if (data.result.modifiedRecordCount === 1) {
                        message.success("修改成功！");
                        // 跳转至 paper-detail
                        navigate(`/systemManage/paper/detail/${params.paper_id}`, { replace: true })
                    }
                    else {
                        message.error("添加失败，请重试！");
                    }
                }
                else message.error("添加失败，请重试！");
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onFinish = (values: any) => {
        //提交修改
        console.log('Received values of form:', values);
        updatePaper(values)
    }

    return (
        <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
            <BackButton />
            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: '100%', marginLeft: 100, fontSize: '16px' }}
            // style={{ maxWidth: 600 }}
            >
                <Form.Item label="试卷名称" name="paperName">
                    <Input size='large' prefix={<FileTextTwoTone />}></Input>
                </Form.Item>

                <Form.Item label="问题列表" >
                    {/* 通过Form.List渲染数组字段 */}
                    <Form.List name="questionList">
                        {fields =>
                            paperDetail.questionList.map((question, index) => (
                                <>
                                    <Form.Item name={[index, 'questionId']}>
                                        <span style={{ fontSize: '16px' }}>
                                            {index + 1}.{' '}<b>({question.questionType}){' '}</b>{question.description}
                                        </span>

                                        {/* 四个答案竖着排列 */}
                                        <List
                                            size='small'
                                            style={{ margin: '16px' }}
                                            bordered
                                            dataSource={question.choice.split(';')}
                                            renderItem={(item) => <List.Item style={{ color: 'steelblue' }}>{item}</List.Item>}
                                        />
                                    </Form.Item>
                                    <Form.Item {...question} key={question.questionId}
                                        name={[index, 'score']}>
                                        <InputNumber key={index} prefix="分值：" style={{ width: '30%', marginLeft: '16px' }} max='100' min='0'
                                            onChange={(value) => { countScore(value, question.questionId) }}
                                            rules={[{ required: true, message: 'Question score is required' }]}
                                        ></InputNumber>
                                    </Form.Item>
                                    <Divider></Divider>
                                </>
                            ))
                        }
                    </Form.List>
                </Form.Item>

                <Form.Item label="试卷总分" name="score" >
                    <InputNumber min={0} max={100}></InputNumber>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div >

    )

}

export default PaperUpdate;