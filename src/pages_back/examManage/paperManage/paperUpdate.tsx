//修改试卷的界面，可以修改试卷名字和各题的分值

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FileTextTwoTone, DeleteTwoTone, PlusOutlined } from '@ant-design/icons';
import { Form, Space, List, Divider, Input, InputNumber, Modal, Button, message } from 'antd';
import BackButton from '../../global/backButton.tsx';
import { PostQuestion, Question } from '../questionManage/questionType.tsx';
import { PaperDetailType } from './paperType.tsx';
import QuestionTable from './questionTable.tsx'

interface TableProps {
    open: boolean,
    onCancel: () => void;

}

const PaperUpdate = () => {
    const params = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate(); //跳转路由

    // const [paperDetail, setPaperDetail] = useState<PaperDetailType>({
    //     "paperId": 1,
    //     "paperName": "",
    //     "score": 100,
    //     "questionList": [
    //         {
    //             "questionId": 0,
    //             "choice": "",
    //             "score": 0,
    //             "description": "",
    //             "questionType": ""
    //         }
    //     ]
    // });

    const [questionList, setQuestionList] = useState<Question[]>([])

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
            fetch(`https://47.120.14.174:443/petHospital/papers/${params.paper_id}?front=false`)
                .then(
                    (response) => response.json(),
                )
                .then((data) => {
                    console.log(data.result);
                    detail = data.result;
                    // setPaperDetail(detail);
                    //赋值给问题列表
                    setQuestionList(detail.questionList);
                    //获取到试卷的detail。给form的各项赋值
                    form.setFieldValue("paperName", detail.paperName); //试卷名
                    form.setFieldValue("score", detail.score); //总分
                    const questionList = detail.questionList;
                    let list: PostQuestion[] = [];
                    for (let i = 0; i < questionList.length; i++) {
                        console.log(questionList[i].score);
                        list.push({ "questionId": questionList[i].questionId, "score": questionList[i].score });
                    }
                    console.log(list)
                    //初始questionlist赋值
                    form.setFieldValue("questionList", list)
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
        else {
            console.log(questionList)
            //监听总分的变化。
            let sum = 0;
            //获取表单中题目列表
            const list = form.getFieldValue("questionList");
            console.log(list)
            list.map(q => {
                console.log('题目' + q.questionId + '的分数为：' + q.score)
                sum += q.score
            })
            console.log('总分为：' + sum)
            form.setFieldValue("score", sum);
        }

        console.log(form.getFieldsValue()); //打印表单的值
    }, [count]);

    //onChange函数 多传一个参数
    const countScore = (_score, question_Id: number,) => {
        console.log(question_Id + "的分数变为：" + _score)
        setCount(count + 1) //用于刷新score数据
    }

    const deleteQuestion = (id: number) => {
        console.log("删除了考题" + id)
        //删除该考题
        setQuestionList(questionList.filter(question => { return question.questionId != id }))
        setCount(count + 1);
    }

    const [open, setOpen] = useState(false);
    //添加考题，加入questionList
    const addQuestion = () => {
        //弹出一个表格
        setOpen(true);
    }

    const getAddList = (selectedList: Question[]) => {
        console.log(selectedList)
        //获取questionList 加到 questionList里面 count + 1
        let list = questionList;
        selectedList.map(q =>{
            list.push(q)
        })
        // list.push(selectedList);
        setQuestionList(list);
        form.setFieldValue("questionList", list)
        setCount(count + 1)
    }

    const QuestionForm: React.FC<TableProps> = ({
        open,
        onCancel,
    }
    ) => {
        return (
            <Modal
                open={open}
                width="80%"
                footer={
                    [] // 设置footer为空，去掉 取消 确定默认按钮
                }
                onCancel={onCancel}
            >
                <QuestionTable getSelectedQuestions={getAddList} setOpen={setOpen} />
                {/* <QuestionInfo /> */}
            </Modal>
        )
    }


    const updatePaper = (values: any) => {
        fetch('https://47.120.14.174:443/petHospital/papers/' + params.paper_id, {
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
            <QuestionForm
                open={open}
                onCancel={() => {
                    setOpen(false);
                }}
            />
            <Form
                form={form}
                onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: '100%', marginLeft: 100, fontSize: '16px' }}
            >
                <Form.Item label="试卷名称" name="paperName"
                    rules={[{ required: true, message: '请填写试卷名称！' }]}>
                    <Input size='large' prefix={<FileTextTwoTone />}></Input>
                </Form.Item>

                {/* 可以新增考题 */}
                <Form.Item label="问题列表" >
                    {/* 通过Form.List渲染数组字段 */}
                    <Form.List name="questionList">
                        {fields =>
                            questionList.map((question, index) => (
                                <>
                                    <Form.Item name={[index, 'questionId']}>
                                        <Space>
                                            <span style={{ fontSize: '16px' }}>
                                                {index + 1}.{' '}<b>({question.questionType}){' '}</b>{question.description}
                                            </span>

                                            <DeleteTwoTone onClick={() => { deleteQuestion(question.questionId) }} />
                                        </Space>

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
                                        name={[index, 'score']}
                                        rules={[{ required: true, message: '请设置分值！' }]}>
                                        <InputNumber key={index} prefix="分值：" style={{ width: '30%', marginLeft: '16px' }} max='200' min='0'
                                            onChange={(value) => { countScore(value, question.questionId) }}
                                        ></InputNumber>
                                    </Form.Item>
                                    <Divider></Divider>
                                </>
                            ))
                        }
                    </Form.List>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" ghost onClick={() => addQuestion()} block icon={<PlusOutlined />}>
                            添加考题
                        </Button>
                    </Form.Item>
                </Form.Item>

                <Form.Item label="试卷总分" name="score" >
                    <InputNumber min={0} max={200}></InputNumber>
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