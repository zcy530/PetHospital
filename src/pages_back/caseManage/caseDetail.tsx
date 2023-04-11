import React, { useState, useEffect } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Divider, Layout, Row, Col, Badge, Descriptions, Image, Checkbox, Form, Input, Select, Button, Alert, Space, Spin } from 'antd';
import axios from "axios";
import { oneDiseaseCaseDetail } from './caseTypeDefine.tsx';
// import { dataFrom_oneDiseaseCaseDetail } from './mockData.tsx';
import Cat from "../../Assets/image/cat2.png";
import { useParams } from 'react-router-dom';
import ImageUpload from './caseInsert/imageUpload.tsx';
import { useForm } from 'antd/es/form/Form.js';
import { CaseFormType, InspectionType } from './caseType.tsx';
import InspectionTable from './caseInsert/inspectionTable.tsx';
import VideoUpload from './caseInsert/videoUpload.tsx';
import { CaseData } from './caseData.js';

export interface detailsProps {
    id: number;
    showDetail: boolean;
    setShowDetail: (showDetail: boolean) => void;
}


const CaseDetail = () => {

    const [caseDetail, setCaseDetail] = useState<oneDiseaseCaseDetail>();
    const [formData, setFormData] = useState<CaseFormType>();

    // const config = {
    //     headers: {
    //         "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6Im1hbmFnZXIiLCJpc3MiOiJzZWN1cml0eSIsImlhdCI6MTY4MDEwMzQ2MiwiYXVkIjoic2VjdXJpdHktYWxsIiwiZXhwIjoxNjgwMTEwNjYyfQ.y-zKf4y5Ip3ySS1kwwtzR7mPm-LCiWrPn2reV5O6Yl8",
    //     }
    // };

    // useEffect(() => {
    //     const fetchDetail = async () => {
    //         const { data } = await axios.get(`/cases/${props.id}?front=1`, config);
    //         setCaseDetail(data.result);
    //         console.log(data.result);
    //     }
    //     fetchDetail();
    // }, [])

    const params = useParams();
    const [form] = useForm();
    // console.log(params)
    useEffect(() => {
        //获取后台数据
        fetch(`http://localhost:8080/petHospital/cases/${params.case_id}?front=false`)
            .then(
                (response) => response.json(),
            )
            .then(async (data) => {
                console.log(data.result);
                setCaseDetail(data.result);
                //设置posts值为data
                const rst = data.result;

                // const inspections: InspectionType = {
                //     inspection_item_id: ;
                //     inspection_name: string;
                //     inspection_result_text: string;
                //     inspection_graphs: [];
                // }

                const formData1: CaseFormType = {
                    admission_graphs: rst.admissionGraphList.map(item => { return item.url }),
                    admission_text: rst.admissionText,
                    // case_id: number,
                    case_title: rst.caseName,
                    diagnostic_result: rst.diagnosticInfo,
                    disease_id: rst.disease ? rst.disease.diseaseId : null,
                    front_graph: rst.frontGraph,
                    inspection_cases: [],
                    therapy_graphs: rst.treatmentGraphList.map(item => { return item.url }),
                    therapy_videos: rst.treatmentVideoList.map(item => { return item.url }),
                    treatment_info: rst.treatmentInfo
                }
                form.setFieldsValue(formData1);
                setFormData(formData1);
                console.log(formData1);
                console.log(formData);

            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    //处理多选框
    const [options, setOptions] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/petHospital/diseases'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                setOptions(data.result);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const { Option } = Select;
    const { TextArea } = Input;

    interface returnType {
        inspection_item_id: number;
        inspection_result_text: string;
        inspection_graphs: [];
    }

    //获取到检查项目信息
    const getInspectionTable = (val: returnType[]) => {
        // console.log(val);
        form.setFieldValue('inspection_cases', val);
    }


    //设置表单禁用
    const [componentDisabled, setComponentDisabled] = useState<boolean>(true);

    return (
        <Layout>
            {
                formData ? (
                    <>
                        <Checkbox
                            checked={componentDisabled}
                            onChange={(e) => setComponentDisabled(e.target.checked)}
                        >
                            Form disabled
                        </Checkbox>
                        <Form
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 14 }}
                            layout="horizontal"
                            disabled={componentDisabled}
                            style={{ maxWidth: 600, textAlign: 'left' }}
                            form={form}
                        >
                            <Form.Item name="case_title" label="病例名称">
                                <Input />
                            </Form.Item>
                            <Form.Item name="front_graph" label="病例封面图">
                                <ImageUpload num={1} mult={false} />
                            </Form.Item>
                            <Form.Item name="diseaseId" label="疾病名称">
                                <Select optionLabelProp="key" defaultValue={formData ? formData.disease_id : null}>
                                    {options.map(item => (
                                        <Option key={item.diseaseName} value={item.diseaseId}>{item.diseaseName}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="admission_text" label="接诊信息">
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item name="admission_graphs" label="接诊图片" valuePropName="fileList">
                                {/* num代表最多可以传几张图片，mult代表是否可以使用批量上传 */}
                                <ImageUpload num={8} mult={true} />
                            </Form.Item>
                            <Form.Item name="inspection_cases" label="检查项目情况" >
                                <InspectionTable getTable={getInspectionTable} />
                            </Form.Item>
                            <Form.Item name="diagnostic_result" label="诊断结果">
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item name="treatment_info" label="治疗方案">
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item name="therapy_graphs" label="治疗方案图片" valuePropName="fileList">
                                <ImageUpload num={8} mult={true} />
                            </Form.Item>
                            <Form.Item name="therapy_videos" label="治疗方案视频">
                                <VideoUpload />
                            </Form.Item>
                            <div style={{ textAlign: 'center', marginTop: 50 }} >
                                <Button type="primary" htmlType="submit">提交</Button>
                            </div>
                        </Form>
                    </>
                ) : (
                    <>
                        <Image width={300} src={Cat} />
                        <Spin tip="加载中...">

                            <Alert
                                message="疯狂加载中"
                                description="不要走开喵"
                                type="info"
                            />
                        </Spin>
                    </>
                )
            }

        </Layout>


    );



    // return (
    //     <Layout className='detail-area'>


    //         <Row>
    //             <Col span={3}>
    //                 <AiOutlineArrowLeft style={{ fontSize: "30px" }} onClick={() => props.setShowDetail(false)} />返回目录
    //             </Col>
    //             <Col span={18}>
    //                 <h4>{caseDetail.caseName}</h4>
    //             </Col>
    //             <Col span={3}>
    //                 查看下一条<AiOutlineArrowRight style={{ fontSize: "30px" }} onClick={() => props.setShowDetail(false)} />
    //             </Col>
    //         </Row>
    //         <Divider />

    //         {/* <h5>就诊记录</h5> */}
    //         <Layout className='detail-table'>
    //             <Descriptions
    //                 column={3}
    //                 bordered size='middle'
    //                 labelStyle={{ justifyContent: 'flex-end' }}
    //                 contentStyle={{ justifyContent: 'flex-end' }}>
    //                 {/* <Descriptions.Item label="动物种类">英短猫</Descriptions.Item>
    //                 <Descriptions.Item label="就医时间">2022.03.04</Descriptions.Item>
    //                 <Descriptions.Item label="就医地点">安永宠物医院</Descriptions.Item> */}
    //                 <Descriptions.Item label="病例名称">{caseDetail.caseName}</Descriptions.Item>
    //                 <Descriptions.Item label="疾病名称">{caseDetail.disease ? caseDetail.disease.typeName : ''}</Descriptions.Item>
    //                 <Descriptions.Item label="疾病类型">{caseDetail.disease ? caseDetail.disease.diseaseName : ''}</Descriptions.Item>
    //                 <Descriptions.Item label="接诊描述" span={3}>{caseDetail.admissionText}</Descriptions.Item>
    //                 <Descriptions.Item label="接诊图片">
    //                     <Image.PreviewGroup
    //                         preview={{
    //                             onChange: (current, prev) =>
    //                                 console.log(`current index: ${current}, prev index: ${prev}`),
    //                         }}
    //                     >
    //                         {caseDetail.admissionGraphList.array.forEach(element => {
    //                             <Image width={300} src={element.url} />
    //                         });}

    //                         <Image width={300} src={Cat} />
    //                         <Image width={300} src={Cat} />
    //                         <Image width={300} src={Cat} />
    //                         <Image width={300} src={Cat} />
    //                     </Image.PreviewGroup>
    //                 </Descriptions.Item>
    //                 <Descriptions.Item label="诊断信息" span={2}>{caseDetail.diagnosticInfo}</Descriptions.Item>
    //                 <Descriptions.Item label="治疗建议" span={3}>
    //                     {caseDetail.treatmentInfo}
    //                 </Descriptions.Item>
    //                 <Descriptions.Item label="联系方式">13896796126</Descriptions.Item>
    //                 <Descriptions.Item label="收费">120元</Descriptions.Item>
    //                 <Descriptions.Item label="住址">太极大道32号</Descriptions.Item>
    //                 <Descriptions.Item label="图片描述">
    //                     <Image.PreviewGroup
    //                         preview={{
    //                             onChange: (current, prev) =>
    //                                 console.log(`current index: ${current}, prev index: ${prev}`),
    //                         }}
    //                     >
    //                         <Image width={300} src={Cat} />
    //                         <Image width={300} src={Cat} />
    //                         <Image width={300} src={Cat} />
    //                         <Image width={300} src={Cat} />
    //                     </Image.PreviewGroup>
    //                 </Descriptions.Item>
    //             </Descriptions>
    //         </Layout>

    //         <h5>检查记录</h5>
    //         <Layout className='detail-table-2'>
    //             <Descriptions
    //                 column={3}
    //                 bordered size='middle'
    //                 labelStyle={{ justifyContent: 'flex-end' }}
    //                 contentStyle={{ justifyContent: 'flex-end' }}>
    //                 <Descriptions.Item label="部门名称" span={2}>化验室</Descriptions.Item>
    //                 <Descriptions.Item label="检查内容">查血</Descriptions.Item>
    //                 <Descriptions.Item label="检查结束">验血相关xxxx</Descriptions.Item>
    //                 <Descriptions.Item label="检查结果">无感染</Descriptions.Item>
    //                 <Descriptions.Item label="费用">100.00</Descriptions.Item>

    //                 <Descriptions.Item label="部门名称" span={2}>化验室</Descriptions.Item>
    //                 <Descriptions.Item label="检查内容">查血</Descriptions.Item>
    //                 <Descriptions.Item label="检查结束">验血相关xxxx</Descriptions.Item>
    //                 <Descriptions.Item label="检查结果">无感染</Descriptions.Item>
    //                 <Descriptions.Item label="费用">100.00</Descriptions.Item>

    //             </Descriptions>
    //         </Layout>

    //     </Layout>
    // )
}
export default CaseDetail;