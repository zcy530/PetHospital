import { Descriptions, Layout, Table, Image } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProcessType, OperationType } from "./processType.tsx";
import BackButton from "../../global/backButton.tsx";
import { useSelector } from "react-redux";


const ProcessDetail = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    const params = useParams();
    //console.log(params)

    const [processData, setProcessData] = useState<ProcessType>();
    const [dataSource, setDataSource] = useState<OperationType[]>();


    useEffect(() => {
        //获取后台数据
        fetch(`https://47.120.14.174:443/petHospital/processes/${params.processId}`, {
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        })
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                //console.log(data.result);
                const tempProcess: ProcessType = {
                    processId: data.result.processId,
                    processName: data.result.processName,
                    intro: data.result.intro,
                }
                setProcessData(tempProcess);
                const tempOperationList: OperationType[] = (data.result.operationList.map((item) => {
                    return ({
                        key: item.operationId,
                        sortNum: item.sortNum,
                        operationName: item.operationName,
                        intro: item.intro,
                        url: item.url,
                    }
                    );
                }));
                setDataSource(tempOperationList)
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, []);


    const columns: ColumnsType<OperationType> = [
        {
            title: '顺序',
            dataIndex: 'sortNum',
        },
        {
            title: '操作名称',
            dataIndex: 'operationName',
        },
        {
            title: '操作介绍',
            dataIndex: 'intro',
        },
        {
            title: '操作图',
            dataIndex: 'url',
            render: (_, record) => (
                <Image
                    width={200}
                    src={record.url}
                />
            ),
        }
    ];


    return (
        <Layout className='system-manage-content'>
            <div style={{ textAlign: 'left' }}><BackButton /></div>
            <Descriptions title="流程信息" column={3}
                bordered size='middle'
                labelStyle={{ justifyContent: 'flex-end' }}
                contentStyle={{ justifyContent: 'flex-end' }}>
                <Descriptions.Item label="流程名称" >{processData?.processName}</Descriptions.Item>
                <Descriptions.Item label="流程描述" span={2}>{processData?.intro}</Descriptions.Item>
                <Descriptions.Item label="操作列表">
                    <Table
                        rowKey="key"
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </Descriptions.Item>
            </Descriptions>
        </Layout>
    );
};

export default ProcessDetail;