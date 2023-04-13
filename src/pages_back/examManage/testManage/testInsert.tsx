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

// TODO: 新增每场考试，可以选择相应的考试试卷(select?)，开始时间(DatePicker)和结束时间，以及哪些学生(multi-select)可以参加考试。

dayjs.extend(customParseFormat);
//时间范围选择器
const { RangePicker } = DatePicker;

const TestInsert: React.FC = () => {
    //全局消息提示 
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: '操作成功',
            duration: 1,
        });
    };

    const fail = () => {
        messageApi.open({
            type: 'error',
            content: '操作失败，请重试！',
            duration: 1
        });
    }

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values of form:', values);
    };


    //从子组件获取paperId并传回
    const getPaperId = (id: number) =>{
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
            fetch('http://localhost:8080/petHospital/tests', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    "beginDate": beginDate,
                    "endDate": endDate,
                    "intro": intro,
                    "paperID": paperId,
                    "tag": tag,
                    "testId": 0,
                    "testName": testName,
                    "userList": userList
                })
            }).then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let res = data.success;
                    if (res === true) success();
                    else fail();
                })
                .catch((err) => {
                    console.log(err.message);
                });
        })
    }

    return (
        <Container style={{ width: '100%', height: '100%' }}>
            {contextHolder}
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
                        rules={[{ required: true, message: 'Test Name is required' }]}>
                        <Input prefix={<FileTextTwoTone />} size='large' />
                    </Form.Item>

                    <Form.Item label="考试简介" name="intro" >
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="选择试卷" name="paperId" 
                    >
                        <PaperSelect getPaper = {getPaperId}/>
                    </Form.Item>

                    <Form.Item label="标签" name="tag">
                        <Input size='large' style={{ width: 160 }} prefix={<TagTwoTone />} />
                    </Form.Item>

                    <Form.Item label="考试时间" name="testDate"
                        rules={[{ required: true, message: 'Time is required' }]}>
                        <RangePicker
                            // disabledDate={disabledDate}
                            // disabledTime={disabledRangeTime}
                            size='large'
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('11:59:59', 'HH:mm:ss')],
                            }}
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </Form.Item>

                    <Form.Item label="参考学生" name="userList">
                        <StudentSelect getStudent = {getUserList} /> 
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

