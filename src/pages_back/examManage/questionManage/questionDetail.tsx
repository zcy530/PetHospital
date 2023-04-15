import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, DeleteTwoTone, EditTwoTone, MinusCircleOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Form, InputRef, List, Modal, Select, Tag } from 'antd';
import { Button, Input, Space, Table, message, Checkbox, Radio, RadioChangeEvent, } from 'antd';
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import TextArea from 'antd/es/input/TextArea';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { QuestionDetailType } from './questionType.tsx'
import BackButton from '../../global/backButton.tsx'
import { useParams } from 'react-router-dom';

const QuestionDetail = () => {
    const param = useParams(); //传参
    const [form] = Form.useForm();
    const [detail, setDetail] = useState<QuestionDetailType>({});

    useEffect(() => {
        fetch("http://localhost:8080/petHospital/questions/" + param.questionId, { method: 'GET' })
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                const res = data.result;
                //设置detail值为data
                setDetail(data.result);
                //form setValue
                form.setFieldValue("description", res.description)
                form.setFieldValue("diseaseName", res.deseaseName)

            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    return (
        <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
            <BackButton />
            <Form
                form={form}
                // onFinish={onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: '100%', marginLeft: 100, }}
                initialValues={{ modifier: 'public' }}
            >
                <Form.Item
                    name="description"
                    label="题目描述:"
                >
                    {/* <span style={{fontSize: '16px'}}>{detail.description}</span> */}
                    <TextArea style={{ color: 'dimgrey' }} readOnly={true} rows={3} />
                </Form.Item>
                <Form.Item
                    name="diseaseName"
                    label="疾病名:"
                >
                    {/* <span style={{fontSize: '16px', color: 'maroon'}}>{detail.diseaseName}</span> */}

                    <Input style={{ color: 'maroon' }} readOnly={true} />
                </Form.Item>
                <Form.Item
                    name="questionType"
                    label="题目类型:"
                >
                    <Tag color={detail.questionType === '判断' ? 'orange' : 'green'}>
                        {detail.questionType}
                    </Tag>
                </Form.Item>
                <Form.Item
                    name="keyword"
                    label="关键词:"
                >
                    <Tag color="geekblue" >{detail.keyword}</Tag>
                    {/* <Input style={{ color: 'mediumpurple' }} readOnly={true} defaultValue={record.keyword} /> */}
                </Form.Item>
                <Form.Item
                    name="choice"
                    label="选项:"
                >
                    <List
                        size="small"
                        bordered
                        dataSource={detail.choice}
                        renderItem={(item) => <List.Item style={{ color: 'steelblue' }}>{item}</List.Item>}
                    />
                </Form.Item>
                <Form.Item
                    name="ans"
                    label="答案:"
                >
                    {/* <Input style={{ color: 'darkseagreen ' }} readOnly={true} value={detail.ans} /> */}
                    <List
                        size="small"
                        bordered
                        dataSource={detail.ans}
                        renderItem={(item) => <List.Item style={{ color: 'darkseagreen' }}>{item}</List.Item>}
                    />
                </Form.Item>

            </Form>
        </div>
    )
}

export default QuestionDetail;