import React, { useState } from 'react';
import { Form, Input, Select, Modal, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { UserType } from './userType.tsx';

const { Option } = Select;

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: UserType) => void;
    onCancel: () => void;
}


const UserCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
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
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [userClass, setUserClass] = useState('');
    return (
        //用Modal弹出表单
        <Modal
            open={open} //是
            title="创建新用户"
            okText="确定"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
                        //value赋值给record
                        setEmail(values.email);
                        setPassword(values.password);
                        setRole(values.role);
                        setUserClass(values.userClass);
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
                success();
                //TODO: fetch post
                fetch('http://localhost:8080/users', {
                    method: 'POST',
                    body: JSON.stringify({
                        email: email,
                        password: password,
                        role: role,
                        userClass: userClass
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Access-Control-Allow-Origin': '*',
                        "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE"
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
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                {/* 填写密码 */}
                <Form.Item name="password" label="密码"
                    rules={[{ required: true, message: 'Please input password!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="input password"
                        visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                    />
                </Form.Item>
                {/* 选择角色 */}
                <Form.Item
                    name="role"
                    label="角色"
                    rules={[{ required: true, message: 'Please select role!' }]}
                >
                    <Select placeholder="Select role">
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
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    )
};

export default UserCreateForm;