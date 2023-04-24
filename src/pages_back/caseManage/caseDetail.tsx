import { Descriptions, Layout, Image, Table } from "antd";
import React, { useEffect, useState } from "react";
import BackButton from "../global/backButton.tsx";
import { useParams } from "react-router-dom";
import { CaseFormType } from "./caseType.tsx";
import { ColumnsType } from "antd/es/table/InternalTable.js";
import { useSelector } from "react-redux";

const CaseDetail = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    const params = useParams();
    //console.log(params)

    //显示在表格中的类型
    interface TableDataType {
        id: number; //增加一个id用于锁定在表格当中的位置，防止同一个检查多个检查信息的情况
        inspection_item_id: number;
        inspection_name: string;
        inspection_result_text: string;
        inspection_graphs: [];
    }


    const [caseData, setCaseData] = useState<CaseFormType>();
    const [inspectionData, setInspectionData] = useState<TableDataType[]>();

    function sortBy(property) {
        return function (value1, value2) {
            let a = value1[property]
            let b = value2[property]

            return a < b ? 1 : a > b ? -1 : 0
        }
    }

    useEffect(() => {
        //获取后台数据
        fetch(`https://47.120.14.174:443/petHospital/cases/${params.case_id}/detail`, {
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        })
            .then(
                (response) => response.json(),
            )
            .then(async (data) => {
                console.log(data.result);
                const data1 = data.result;
                setCaseData(data1);
                const tempInspectionData = data1.inspectionCaseList?.map((item, i) => {
                    return {
                        id: i,
                        inspection_item_id: item.inspectionItem.itemId,
                        inspection_name: item.inspectionItem.itemName,
                        inspection_result_text: item.result,
                        inspection_graphs: (item.inspectionGraphs?.sort(sortBy('sortNum'))).map(j => { return j.url }),
                    }
                })
                //console.log(tempInspectionData);
                setInspectionData(tempInspectionData);

            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, []);




    // 定义检查项目表中的列
    const columns: ColumnsType<TableDataType> = [
        {
            title: '检查名称',
            dataIndex: 'inspection_name',
            key: 'inspection_name',
        },
        {
            title: '检查情况',
            dataIndex: 'inspection_result_text',
            key: 'inspection_result_text',

        },
        {
            title: '操作图',
            dataIndex: 'inspection_graphs',
            render: (_, record) => (
                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) =>
                            console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >
                    {record.inspection_graphs?.map((item, i) => (
                        <Image width={350} height={250} style={{ padding: '10px' }} src={item} />
                    ))}
                </Image.PreviewGroup>
            ),
        }
    ];


    return (
        <Layout className='system-manage-content'>
            <div style={{ textAlign: 'left' }}><BackButton /></div>
            <Descriptions title="病例信息" column={3}
                bordered size='middle'
                labelStyle={{ justifyContent: 'flex-end' }}
                contentStyle={{ justifyContent: 'flex-end' }}>
                <Descriptions.Item label="病例ID" >{caseData?.caseId}</Descriptions.Item>
                <Descriptions.Item label="病例名称" >{caseData?.caseName}</Descriptions.Item>
                <Descriptions.Item label="疾病名称" >{caseData?.disease?.diseaseName}</Descriptions.Item>
                <Descriptions.Item label="疾病类型" >{caseData?.disease?.typeName}</Descriptions.Item>
                <Descriptions.Item label="接诊信息" span={2}>{caseData?.admissionText} </Descriptions.Item>
                <Descriptions.Item label="病例封面">
                    {
                        caseData?.frontGraph ? (
                            <>
                                <Image width={350} height={250} style={{ padding: '10px' }} src={caseData.frontGraph} />
                            </>
                        ) : (
                            <>
                            </>
                        )
                    }

                </Descriptions.Item>

                <Descriptions.Item label="接诊图片" span={2}>
                    <Image.PreviewGroup
                        preview={{
                            onChange: (current, prev) =>
                                console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                        {caseData?.admissionGraphList.map((item, i) => (
                            <Image width={350} height={250} style={{ padding: '10px' }} src={item} />
                        ))}
                    </Image.PreviewGroup>
                </Descriptions.Item>
                <Descriptions.Item label="诊断结果" span={3}>{caseData?.diagnosticInfo} </Descriptions.Item>
                <Descriptions.Item label="检查列表" span={3}>
                    <Table
                        rowKey="key"
                        columns={columns}
                        dataSource={inspectionData}
                        pagination={false}
                    />
                </Descriptions.Item>
                <Descriptions.Item label="治疗方案" span={3}> {caseData?.treatmentInfo}</Descriptions.Item>
                <Descriptions.Item label="治疗方案图片" span={3}>
                    <Image.PreviewGroup
                        preview={{
                            onChange: (current, prev) =>
                                console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                        {caseData?.treatmentGraphList.map((item, i) => (
                            <Image width={350} height={250} style={{ padding: '10px' }} src={item} />
                        ))}
                    </Image.PreviewGroup>
                </Descriptions.Item>
                <Descriptions.Item label="治疗方案视频" span={3}>
                    {caseData?.treatmentVideoList.map((item, i) => (
                        <video id="playChatVideo" width="680" height="410" style={{ marginBottom: '20' }} controls>
                            <source src={item} type="video/mp4"></source>
                        </video>
                    ))}
                </Descriptions.Item>

            </Descriptions>
        </Layout>
    );
}

export default CaseDetail;
