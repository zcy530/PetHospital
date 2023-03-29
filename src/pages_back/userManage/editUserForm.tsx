import React, { useState } from 'react';
import { Form, Input, Select, Modal, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { UserType } from './userType.tsx';

const { Option } = Select;

interface CollectionCreateFormProps {
    open: boolean;
    record: UserType;
    onCreate: (values: UserType) => void;
    onCancel: () => void;
}

const UserEditForm: React.FC<CollectionCreateFormProps> = ({
    open,
    record,
    onCreate,
    onCancel,
}) => {
     //全局消息提示
     const [messageApi, contextHolder] = message.useMessage();

     const success = () => {
         messageApi
             .open({
                 type: 'loading',
                 content: 'Action in progress..',
                 duration: 1,
             })
             .then(() => message.success('操作成功！', 1.5))
         return;
     };
 
     const fail = () => {
         messageApi
             .open({
                 type: 'loading',
                 content: 'Action in progress..',
                 duration: 1,
             })
             .then(() => message.error('操作失败，请重试！', 1.5))
     }
    const [form] = Form.useForm();
    const [email, setEmail] = useState('');
    //为什么这里不能直接set去给它初始化一个值？
    const [role, setRole] = useState('');
    const [userClass, setUserClass] = useState('');
    console.log('要修改：' + record.userId + ' ' + record.email + ' ' + record.role + ' ' + record.userClass);

    return (
        //用Modal弹出表单
        <Modal
            open={open} //是
            title="修改用户信息"
            okText="确定"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                        setEmail(values.email);
                        setRole(values.role);
                        setUserClass(values.userClass);
                        console.log('修改后：' + email + ' ' + role + ' ' + userClass)
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
                //TODO: fetch update 
                fetch(`http://localhost:8080/users/` + record.userId, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        email: email,
                        role: role,
                        userClass: userClass
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Access-Control-Allow-Origin': '*',
                        "Access-Control-Allow-Methods": "POST, PATCH, GET, OPTIONS, PUT, DELETE"
                    },
                    mode: "cors"
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data.result);
                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }}
        >
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{ modifier: 'public' }}
            >
                {/* 填写邮箱 */}
                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[{ required: true, message: 'Please input email!' }]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder={record.email} />
                </Form.Item>

                {/* 选择角色 */}
                <Form.Item
                    name="role"
                    label="角色"
                    rules={[{ required: true, message: 'Please select role!' }]}
                >
                    <Select placeholder={record.role}>
                        <Option value="student">student</Option>
                        <Option value="manager">manager</Option>
                    </Select>
                </Form.Item>

                {/* 选择班级 */}
                <Form.Item
                    name="userClass"
                    label="班级"
                    rules={[{ required: true, message: 'Please input class!' }]}
                >
                    <Input placeholder={record.userClass} />
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default UserEditForm;