//修改试卷的界面，可以修改试卷名字和各题的分值

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined, TagTwoTone, LeftCircleTwoTone, LeftOutlined, FileTextTwoTone } from '@ant-design/icons';
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

    const [scoreList, setScoreList] = useState<number[]>([]);
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
                    setTimeout(() => {
                        setPaperDetail(detail);
                        console.log(paperDetail);
                    }, 0);
                    form.setFieldValue("paperName", detail.paperName);
                    form.setFieldValue("score", detail.score);
                    const questionList = detail.questionList;
                    // TODO: 
                    let list: PostQuestion[] = [];
                    for (let i = 0; i < questionList.length; i++) {
                        console.log(questionList[i].score);
                        list.push({ "questionId": questionList[i].questionId, "score": questionList[i].score });
                    }
                    console.log(list)
                    form.setFieldValue("questionList", list)
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
        //监听总分的变化。
        let sum = 0;
        post.map(record => {
            console.log(record.score);
            sum += record.score;
        })
        console.log('总分为：' + sum)
        form.setFieldValue("score", sum);
    }, [count]);


    //onChange函数 多传一个参数
    const countScore = (_score, question_Id: number,) => {
        // let scorelist : number[] = [];
        console.log(_score)
        console.log('id:' + question_Id);
        //新建一个postQuestion的类型
        let question: PostQuestion = {
            questionId: 0,
            score: 0
        };
        question = { "questionId": question_Id, "score": _score }; //赋值 
        let exist = false; //标记post里是否已经存在question
        //post不为空 -- 判断这个题目是否赋值
        if (post !== null) {
            post.map(record => {
                if (record.questionId === question_Id) {
                    exist = true;
                    //先过滤/删除原来的元素
                    let newPost = post.filter((p) => p.questionId !== question_Id);
                    newPost.push(question);
                    setPost(newPost); //再重新set Post
                }
            })
            if (exist === false) {
                //如果不存在对应的题目
                let newPost = post;
                newPost.push(question);
                setPost(newPost);
            }
        } else {
            //如果post为空 -- 直接setData
            setPost([question]);
        }
        //给对应的表单questionList设置值
        form.setFieldValue("questionList", post);
        setCount(count + 1) //用于刷新score数据
    }

    const onFinish = (values: any) => {
        //提交修改
        console.log('Received values of form:', values);
        //todo: 上传到post
        fetch('http://localhost:8080/petHospital/papers/' + params.paper_id, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "paperId": 0,
                "paperName": values.paperName,
                "questionList": values.questionList,
                "score": values.score,
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
        //跳转至详情页面
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

                <Form.Item label="题目列表" name="questionList">
                    {paperDetail.questionList.map((question, index) => (
                        <Form.Item name="score">
                            <Space >
                                <span style={{ fontSize: '16px' }}>
                                    {index + 1}.{' '}<b>({question.questionType}){' '}</b>{question.description}
                                </span>
                                <InputNumber key={index} prefix="分值：" style={{ width: '50%' }} max='100' min='0' onChange={(value) => { countScore(value, question.questionId) }}></InputNumber>
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