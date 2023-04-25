import React, { useEffect, useState } from 'react'
import { Divider, InputNumber, List, message } from "antd";
import { FileTextTwoTone } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../global/backButton.tsx';
import { QuestionDetail, PostQuestion } from './questionDetail.tsx';
import Loading from '../../global/loading.tsx'
import { useSelector } from 'react-redux';

//传入参数：questionIdList: number[]
const GeneratePaper = () => {
    const userLogin = useSelector(state => state.userLogin)
    const token = userLogin.userInfo.data.result.token;
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
        await fetch(`https://47.120.14.174:443/petHospital/questions/${id}?front=false`,
            { headers: { 'Authorization': token } }
        )
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
    //上传的数据
    const [post, setPost] = useState<PostQuestion[]>([]);
    const [count, setCount] = useState(0); //用于监听变化


    useEffect(() => {
        //如果questions未被set过 setValue 若有值 不重新渲染。
        if (questions.length === 0) {
            // TODO: 串行执行
            let questionList: QuestionDetail[] = [];
            list.forEach(async id => {
                questionList.push(await getQuestion(id))
            });
            setTimeout(() => {
                // 直接setData
                setQuestions(questionList)
            }, 500)
        }
        //监听总分的变化。
        let sum = 0;
        post.map(record => {
            console.log(record.score);
            sum += record.score;
        })
        form.setFieldValue("score", sum);
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
        console.log("题目" + question_Id + "的分值为" + _score)
        //新建一个postQuestion的类型
        let question: PostQuestion = {
            questionId: 0,
            score: 0
        };
        question = { "questionId": question_Id, "score": _score };
        console.log("题目" + question.questionId + "分值" + question.score);
        //更新questionList里面的数据
        let exist = false; //标记post里是否已经存在question
        //post不为空 -- 判断这个题目是否赋值
        if (post !== null) {
            post.map(record => {
                if (record.questionId === question_Id) {
                    exist = true;
                    updatePost(question_Id, _score)
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
        console.log(post)
        setCount(count + 1) //用于刷新score数据
    }

    const [form] = Form.useForm();

    const postPaper = (values: any) => {
        //todo: 上传到post
        fetch('https://47.120.14.174:443/petHospital/papers', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': token
            },
            body: JSON.stringify({
                "paperId": 0,
                "paperName": values.paperName,
                "questionList": post, //直接上传post就好了！！
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
    }

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
        setTimeout(() => {
            postPaper(values)
        }, 500)
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
                        rules={[{ required: true, message: '请填写试卷名称！' }]}>
                        <Input prefix={<FileTextTwoTone />} size='large' placeholder='请填写试卷名称' />
                    </Form.Item>


                    <Form.Item label="问题列表" >
                        {/* 通过Form.List渲染数组字段 */}
                        <Form.List name="questionList">
                            {fields =>
                                questions.map((question, index) => (
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
                                                dataSource={question.choice}
                                                renderItem={(item) => <List.Item style={{ color: 'steelblue' }}>{item}</List.Item>}
                                            />
                                        </Form.Item>
                                        <Form.Item {...question} key={question.questionId}
                                            name={[index, 'score']}
                                            rules={[{ required: true, message: '请设置分值！' }]}>

                                            <InputNumber prefix="分值：" style={{ width: '30%', marginLeft: '16px' }} max='200' min='0'
                                                onChange={(value) => { countScore(value, question.questionId) }}
                                            ></InputNumber>
                                        </Form.Item>
                                        <Divider></Divider>
                                    </>
                                ))
                            }
                        </Form.List>
                    </Form.Item>


                    <Form.Item label="试卷总分" name="score" >
                        <InputNumber min={0} max={200}></InputNumber>
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            确认生成
                        </Button>
                    </Form.Item>
                </Form >

            </>) : (<><Loading /></>)}
        </div>
    )
}


export default GeneratePaper;
