import { Descriptions, Layout, Table, Image, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BackButton from "../../global/backButton.tsx";
import { RoleType } from "./roleType.tsx";
import { ProcessType } from "../processManage/processType.tsx";
import { EyeOutlined } from '@ant-design/icons';


const RoleDetail = () => {

    const params = useParams();
    // console.log(params)

    const [role, setRole] = useState<RoleType>();
    const [dataSource, setDataSource] = useState<ProcessType[]>();


    useEffect(() => {
        //获取后台数据
        fetch(`http://localhost:8080/petHospital/actors/${params.actorId}`
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // console.log(data.result);
                const tempRole: RoleType = {
                    actorId: data.result.processId,
                    name: data.result.name,
                    content: data.result.content,
                    responsibility: data.result.responsibility,
                }
                setRole(tempRole);
                setDataSource(data.result.processList);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


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


    return (
        <Layout className='system-manage-content'>
            <div style={{ textAlign: 'left' }}><BackButton /></div>
            <Descriptions title="角色信息" column={3}
                bordered size='middle'
                labelStyle={{ justifyContent: 'flex-end' }}
                contentStyle={{ justifyContent: 'flex-end' }}>
                <Descriptions.Item label="角色名称" >{role?.name}</Descriptions.Item>
                <Descriptions.Item label="工作内容" span={2}>{role?.content}</Descriptions.Item>
                <Descriptions.Item label="职责" span={3}>{role?.responsibility}</Descriptions.Item>
                <Descriptions.Item label="相关流程">
                    <Table
                        rowKey="processId"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </Descriptions.Item>
            </Descriptions>
        </Layout>
    );
};

export default RoleDetail;