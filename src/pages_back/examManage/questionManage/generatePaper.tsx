import React, { useEffect, useState } from 'react'
import { Divider, InputNumber, List, message } from "antd";
import { FileTextTwoTone } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    Space,
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../global/backButton.tsx';
import {QuestionDetail, PostQuestion} from './questionDetail.tsx';


//传入参数：questionIdList: number[]
const GeneratePaper = () => {
    //使用钩子获取state
    const { state } = useLocation();
    const list = state.questionList;
    const navigate = useNavigate(); //跳转路由

    //问题列表
    const [questions, setQuestions] = useState<QuestionDetail[]>([]);

    //获取题目详情
    const getQuestion = async (id: number) => {
        let question: QuestionDetail = {
            questionId: 0,
            questionType: '',
            description: '',
            choice: [],
            ans: '',
            keyword: ''
        };
        await fetch(`http://localhost:8080/petHospital/questions/${id}?front=false`)
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                let res = data.result;
                question = res;
            })
            .catch((err) => {
                console.log(err.message);
            });
        return question;
    }

    //试卷名字、试题列表、总分值（自动计算） Form
    const [score, setScore] = useState(0);
    const [post, setPost] = useState<PostQuestion[]>([]);
    const [count, setCount] = useState(0); //用于监听变化

    useEffect(() => {
        //TODO: 串行执行
        let questionList: QuestionDetail[] = [];
        // list.map(async id => {
        //     questionList.push(await getQuestion(id))
        // })
        list.forEach(async id => {
            questionList.push(await getQuestion(id))
        });
        // for(let i = 0; i< list.length; i++) {
        //     questionList.push(await getQuestion(list[i]))
        // }
        setTimeout(() => {
            // 直接setData
            setQuestions(questionList)
        }, 500)
        let sum = 0;
        post.map(record => {
            console.log(record.score);
            sum += record.score;
        })
        setScore(sum);
        form.setFieldValue("score", sum);
    }, [count]);

    //onChange函数 多传一个参数
    const countScore = (_score, question_Id: number,) => {
        setCount(count + 1)
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
        //给对应的表单设置值
        form.setFieldValue("questionList", post);
    }

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
        //todo: 上传到post
        fetch('http://localhost:8080/petHospital/papers', {
            method: 'POST',
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
                    message.success("添加成功！");
                    // 跳转至 paper-detail
                    navigate(`/systemManage/paper/detail/${data.result.paperId}`, { replace: true })
                }
                else message.error("添加失败，请重试！");
            })
            .catch((err) => {
                console.log(err.message);
            });
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
                        <Input prefix={<FileTextTwoTone />} size='large' placeholder='请填写试卷名称' />
                    </Form.Item>

                    <Form.Item label="问题列表" name={"questionList"}>
                        <>
                            {questions.map((question, index) => (
                                <Form.Item >
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
                                        dataSource={question.choice}
                                        renderItem={(item) => <List.Item style={{ color: 'steelblue' }}>{item}</List.Item>}
                                    />
                                    <Divider></Divider>
                                </Form.Item>

                            ))}
                        </>
                    </Form.Item>

                    <Form.Item label="试卷总分" name="score" >
                        <span style={{ fontSize: '16px' }}>{score} 分</span>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            确认生成
                        </Button>
                    </Form.Item>
                </Form >

            </>) : (<>正在加载中，请稍等！</>)}
        </div>
    )
}


export default GeneratePaper;
