import { Button, Form, Input, Layout, Space, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { ProcessType } from "../processManage/processType.tsx";
import { ColumnsType } from "antd/es/table/InternalTable.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EyeOutlined } from '@ant-design/icons';
import { RoleType } from "./roleType.tsx";
import BackButton from "../../global/backButton.tsx";
import Loading from "../../global/loading.tsx";
import { useSelector } from "react-redux";



const { TextArea } = Input;
const RoleUpdate = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    const params = useParams();

    const [form] = useForm();
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<ProcessType[]>();

    /**
    * 多选部分
    */

    //用于多选的变量和函数
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);

    //重置选择状态
    const reload = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    //监听选择框编号
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        //console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        form.setFieldValue("processList", newSelectedRowKeys);
    };

    //定义每行前面的选择框
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    const columns: ColumnsType<ProcessType> = [
        {
            title: '流程Id',
            dataIndex: 'processId',
            key: 'processId'
        },
        {
            title: '流程名称',
            dataIndex: 'processName',
        },
        {
            title: '流程介绍',
            dataIndex: 'intro',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/systemManage/process/detail/${record.processId}`}>
                        <EyeOutlined />
                    </Link>
                </Space>
            ),
        }
    ];


    useEffect(() => {
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/processes', {
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        }
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // //console.log(data.result);
                setDataSource(data.result);
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, []);



    useEffect(() => {
        //获取后台数据
        fetch(`https://47.120.14.174:443/petHospital/actors/${params.actorId}`, {
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        }
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // //console.log(data.result);
                const tempRole: RoleType = {
                    actorId: data.result.actorId,
                    name: data.result.name,
                    content: data.result.content,
                    responsibility: data.result.responsibility,
                }
                form.setFieldsValue(tempRole);
                //console.log(data.result.processList)
                const tempSelectKeys: React.Key[] = data.result.processList.map((item) => { return item.processId });
                //console.log(tempSelectKeys)
                if (dataSource !== null) setSelectedRowKeys(tempSelectKeys);
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, []);

    function onFinish(values: any): void {
        //console.log(values)
        values.processList = selectedRowKeys;
        //console.log(values)
        //console.log(JSON.stringify(values))
        fetch(`https://47.120.14.174:443/petHospital/actors/${params.actorId}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "Authorization": userInfo.data.result.token,
            },
            body: JSON.stringify(values)
        })
            .then((response) => response.json())
            .then((data) => {
                // //console.log(data);
                let res = data.success;
                if (res === true) {
                    message.success("修改成功！")
                    navigate(`/systemManage/role/detail/${values.actorId}`, { replace: true })
                }
                else {
                    message.error("修改失败！")
                }
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }


    return (
        <Layout className='system-manage-content'>
            <div style={{ textAlign: 'left' }}><BackButton /></div>
            {
                form && dataSource && selectedRowKeys ? (
                    <div style={{ textAlign: 'left' }}>
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 18 }}
                            layout="horizontal"
                            style={{ maxWidth: '100%' }}
                            form={form} name="process_insert"
                            onFinish={onFinish}
                        >
                            <Form.Item name="actorId" hidden={true} />
                            <Form.Item name="name" label="角色名称" rules={[{ required: true, message: '请输入角色名称！' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="content" label="工作内容">
                                <TextArea rows={2} />
                            </Form.Item>
                            <Form.Item name="responsibility" label="职责">
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item name="processList" label="流程列表" rules={[{ required: true, message: '请至少选择一个流程！' }]}>
                                <Table
                                    rowSelection={rowSelection}
                                    rowKey="processId"
                                    columns={columns}
                                    dataSource={dataSource}
                                    pagination={false}
                                    scroll={{ y: 800 }}
                                />
                            </Form.Item>
                            <div style={{ textAlign: 'center', marginTop: 50 }} >
                                <Button type="primary" htmlType="submit">提交</Button>
                            </div>
                        </Form>
                    </div>

                ) : (
                    <>
                        <Loading />
                    </>
                )
            }

        </Layout>

    );

}

export default RoleUpdate;