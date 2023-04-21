import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined, TagTwoTone, LeftCircleTwoTone, LeftOutlined, FileTextTwoTone } from '@ant-design/icons';
import { Form, Space, List, Divider, Input, Tag, Avatar } from 'antd';
import BackButton from '../../global/backButton.tsx';
import { TestDetailType } from './testType.tsx'
import TextArea from 'antd/es/input/TextArea';


const TestDetail = () => {
    const param = useParams();
    const [detail, setDetail] = useState<TestDetailType>({});
    const [form] = Form.useForm();

    useEffect(() => {
        fetch("https://47.120.14.174:443/petHospital/tests/" + param.testId, { method: 'GET' })
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                let res = data.result;
                //设置detail值为data
                setDetail(res);
                //set form
                const formData = {
                    "paperName": res.paperName,
                    "intro": res.intro,
                    "tag": res.tag,
                    "beginDate": res.beginDate,
                    "endDate": res.endDate,
                    "userList": res.userList
                }
                form.setFieldsValue(formData);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [])

    return (
        <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
            <BackButton />
            <Form
                form={form}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                style={{ maxWidth: '100%', marginLeft: 100, fontSize: '16px' }}
            >
                <Form.Item label="试卷名称" name="paperName" >
                    {/* <span style={{ fontSize: '16px', border: '2px solid #ddd', padding: '8px', borderRadius: '15px' }}>{<FileTextTwoTone />} {detail.paperName}</span> */}
                    <Input readOnly={true} prefix={<FileTextTwoTone />} size='large' />
                </Form.Item>

                <Form.Item label="简介" name="intro">
                    <TextArea readOnly = {true} rows={5} />
                </Form.Item>

                <Form.Item label="标签" name="tag">
                    <Tag color='blue'>
                        {detail.tag}
                    </Tag>
                </Form.Item>

                <Form.Item label="开始时间" name="beginDate">
                    <Tag color='orange'>
                        {detail.beginDate}
                    </Tag>
                </Form.Item>
                <Form.Item label="结束时间" name="endDate">
                    <Tag color='green'>
                        {detail.endDate}
                    </Tag>
                </Form.Item>
                <Form.Item label="参考学生" name="userList">
                    <List
                        itemLayout="horizontal"
                        dataSource={detail.userList}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                                    title={<a>{item.email}</a>}
                                    description={"参加考试的学生" + (index + 1)}
                                />
                            </List.Item>
                        )}
                    />
                </Form.Item>

            </Form>
        </div >

    )
}

export default TestDetail;