import React, { useEffect, useState } from 'react';
import { TagTwoTone, FileTextTwoTone } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    DatePicker,
    message,
    Select,
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Container } from 'react-bootstrap';
import TextArea from 'antd/es/input/TextArea';
import BackButton from '../../global/backButton.tsx';
import { TestDetailType } from './testType.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../global/loading.tsx';

// TODO: 新增每场考试，可以选择相应的考试试卷(select?)，开始时间(DatePicker)和结束时间，以及哪些学生(multi-select)可以参加考试。

dayjs.extend(customParseFormat);
//时间范围选择器
const { RangePicker } = DatePicker;

interface studentOption {
    userId: number,
    email: string
}

interface paperOption {
    id: number,
    name: string
}

const { Option } = Select;

const TestUpdate: React.FC = () => {
    const param = useParams();
    const navigate = useNavigate(); //跳转路由

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };

    const [paperId, setPaperId] = useState(0);
    const handlePaperChange = (e) => {
        console.log(e);
        setPaperId(e);
        form.setFieldValue('paperId', e);
    }

    const [userList, setUserList] = useState<number[]>()
    const handleStudentChange = (e) => {
        console.log(e);
        setUserList(e); //设置userList
        form.setFieldValue('userList', e);
    }

    //获取原场次信息
    const [detail, setDetail] = useState<TestDetailType>({});

    //时间格式的转换 GMT转string
    const GMTToStr = (time: string) => {
        let date = new Date(time)
        let Str = date.getFullYear() + '-' +
            (date.getMonth() + 1) + '-' +
            date.getDate() + ' ' +
            date.getHours() + ':' +
            date.getMinutes() + ':' +
            date.getSeconds()
        return Str
    }

    const submitTest = () => {
        let paperId = 0;
        let testName = '';
        let beginDate = '';
        let endDate = '';
        let intro = '';
        let tag = '';
        let userList: number[] = [];
        //获取表单的值
        form.validateFields().then((values) => {
            console.log('Received values of form: ', values);
            paperId = values.paperId;
            testName = values.testName;
            beginDate = GMTToStr(values.testDate[0]);
            endDate = GMTToStr(values.testDate[1]);
            intro = values.intro;
            tag = values.tag;
            userList = values.userList;
            fetch('https://47.120.14.174:443/petHospital/tests/' + param.testId, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    "beginDate": beginDate,
                    "endDate": endDate,
                    "intro": intro,
                    "paperId": paperId,
                    "tag": tag,
                    "testId": param.testId,
                    "testName": testName,
                    "userList": userList
                })
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (data.success === true) {
                        let res = data.result.modifiedRecordCount; //修改的个数
                        if (res === 1) {
                            message.success("修改成功！")
                            // 跳转至 test-detail
                            navigate(`/systemManage/test/detail/${param.testId}`, { replace: true })
                        }
                        else {
                            message.error("修改失败，请稍后再试！");
                        }
                    }
                    else message.error("修改失败，请稍后再试！");
                })
                .catch((err) => {
                    message.error("修改失败，请稍后再试！");
                    console.log(err.message);
                });
        })
    }

    const getTestDetail = () => {
        fetch("https://47.120.14.174:443/petHospital/tests/" + param.testId, { method: 'GET' })
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // console.log(data.result);
                let res = data.result;
                //设置detail值为data
                setDetail(res);
                // form setFieldValue
                // 时间转换为dayjs
                const begin = dayjs(res.beginDate);
                const end = dayjs(res.endDate);

                form.setFieldValue("testName", res.testName)
                //原始试卷
                form.setFieldValue("paperId", res.paperId)
                form.setFieldValue("intro", res.intro)
                form.setFieldValue("tag", res.tag)
                form.setFieldValue("testDate", [begin, end])

                //设置默认的users
                let list: number[] = []
                res.userList.map(user => {
                    list.push(user.userId);
                }
                )
                console.log(list)
                form.setFieldValue("userList", list)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const [paperList, setPaper] = useState<paperOption[]>([]);

    const getPaperList = () => {
        fetch('https://47.120.14.174:443/petHospital/papers'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // console.log(data.result);
                const lists = data.result;
                let paper_List: paperOption[] = [];
                lists.map(list => {
                    paper_List.push({ "id": list.paperId, "name": list.paperName })
                })
                //赋值给paper
                setPaper(paper_List);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const [studentList, setStudent] = useState<studentOption[]>([]);
    const getStudentList = () => {
        fetch('https://47.120.14.174:443/petHospital/users')
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                const lists = data.result;
                let student_List: studentOption[] = [];
                lists.map(list => {
                    if (list.role === 'user')
                        student_List.push({ "userId": list.userId, "email": list.email })
                })
                //赋值给paper
                setStudent(student_List);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }


    useEffect(() => {
        
        //试卷列表和学生列表
        getPaperList();
        getStudentList();
        //后台获取数据
        getTestDetail();
    }, [])


    return (
        <Container style={{ width: '100%', height: '100%' }}>
            <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
                <BackButton />
                <Form
                    form={form}
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    style={{ maxWidth: '100%', marginLeft: 100 }}
                >

                    <Form.Item label="考试名称" name="testName"
                        rules={[{ required: true, message: '请输入考试名称！' }]}>
                        <Input prefix={<FileTextTwoTone />} size='large' />
                    </Form.Item>

                    <Form.Item label="考试简介" name="intro" >
                        <TextArea rows={5} />
                    </Form.Item>

                    <Form.Item label="选择试卷" name="paperId"
                        rules={[{ required: true, message: '请选择试卷！' }]}>
                        <Select
                            size="large"
                            showSearch //带搜索的选择框
                            style={{ width: 160 }}
                            placeholder="Select a paper"
                            onChange={handlePaperChange}
                        >
                            {
                                paperList ? (
                                    paperList.map(paper =>
                                        <Option value={paper.id}> {paper.name} </Option>
                                    )
                                ) : (
                                    <>
                                        <Loading />
                                    </>
                                )
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item label="标签" name="tag">
                        <Input size='large' style={{ width: 160 }} prefix={<TagTwoTone />} />
                    </Form.Item>

                    <Form.Item label="考试时间" name="testDate"
                        rules={[{ required: true, message: '请设置考试时间！' }]}>
                        <RangePicker
                            size='large'
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </Form.Item>

                    <Form.Item label="参考学生" name="userList">
                        <Select
                            size="large"
                            // showSearch //带搜索的选择框
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="选择参加考试的学生"
                            onChange={handleStudentChange} >
                            {
                                studentList ? (
                                    studentList.map(student =>
                                        <Option value={student.userId}> {student.email} </Option>
                                    )
                                ) : (
                                    <>
                                        <Loading />
                                    </>
                                )
                            }

                        </Select>
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" onClick={submitTest}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Container >
    );

}

export default TestUpdate;

