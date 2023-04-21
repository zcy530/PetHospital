import React, { useState } from 'react';
import { TagTwoTone, FileTextTwoTone } from '@ant-design/icons';
import {
    Form,
    Input,
    Button,
    DatePicker,
    message,
} from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Container } from 'react-bootstrap';
import PaperSelect from '../paperSelect.tsx';
import StudentSelect from '../studentSelect.tsx';
import TextArea from 'antd/es/input/TextArea';
import BackButton from '../../global/backButton.tsx';
import { useNavigate } from 'react-router-dom';

dayjs.extend(customParseFormat);
//时间范围选择器
const { RangePicker } = DatePicker;

const TestInsert: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate(); //跳转路由

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };


    //从子组件获取paperId并传回
    const getPaperId = (id: number) => {
        form.setFieldValue('paperId', id);
    }

    //从子组件获得studentIdList并传回
    const getUserList = (idList: number[]) => {
        form.setFieldValue('userList', idList);
    }

    //时间格式的转换
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
            fetch('https://47.120.14.174:443/petHospital/tests', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    "beginDate": beginDate,
                    "endDate": endDate,
                    "intro": intro,
                    "paperId": paperId,
                    "tag": tag,
                    "testId": 0,
                    "testName": testName,
                    "userList": userList
                })
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let res = data.success;
                    if (res === true) {
                        message.success("添加成功！")
                         // 跳转至 test-detail
                         navigate(`/systemManage/test/detail/${data.result.testId}`, { replace: true })
                    }
                    else message.error("添加失败，请稍后再试！");
                })
                .catch((err) => {
                    console.log(err.message);
                });
        })
    }

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
                        <PaperSelect getPaper={getPaperId} />
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
                        <StudentSelect getStudent={getUserList} />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit" onClick={submitTest}>
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Container>
    );

}

export default TestInsert;

