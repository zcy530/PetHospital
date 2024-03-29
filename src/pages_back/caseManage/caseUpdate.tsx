import React, { useState, useEffect } from 'react'
import { Layout, Form, Input, Select, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUpload from './caseInsert/imageUpload.tsx';
import { useForm } from 'antd/es/form/Form.js';
import { CaseFormType } from './caseType.tsx';
import InspectionTable from './caseInsert/inspectionTable.tsx';
import VideoUpload from './caseInsert/videoUpload.tsx';
import Loading from '../global/loading.tsx';
import BackButton from "../global/backButton.tsx";
import { useSelector } from 'react-redux';

export interface detailsProps {
    id: number;
    showDetail: boolean;
    setShowDetail: (showDetail: boolean) => void;
}


const CaseUpdate = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    const params = useParams();
    const [form] = useForm();
    const navigate = useNavigate();
    const [caseData, setCaseData] = useState<CaseFormType>();

    // //console.log(params)
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
                //console.log(data.result);
                //设置posts值为data
                const rst = data.result;

                setCaseData(data.result);
                const formData1 = {
                    admission_graphs: rst.admissionGraphList,
                    admission_text: rst.admissionText,
                    case_id: rst.caseId,
                    case_title: rst.caseName,
                    diagnostic_result: rst.diagnosticInfo,
                    disease_id: rst.disease ? rst.disease.diseaseId : null,
                    front_graph: [rst.frontGraph],
                    inspection_cases: rst.inspectionCaseList,
                    therapy_graphs: rst.treatmentGraphList,
                    therapy_videos: rst.treatmentVideoList,
                    treatment_info: rst.treatmentInfo
                }
                form.setFieldsValue(formData1);
                //console.log(formData1);
                //console.log(caseData);

            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, []);


    //处理多选框
    const [options, setOptions] = useState([]);
    useEffect(() => {
        fetch('https://47.120.14.174:443/petHospital/diseases', {
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        }
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                //console.log(data.result);
                setOptions(data.result);
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, []);

    const { Option } = Select;
    const { TextArea } = Input;
    const [videoReady, setVideoReady] = useState(true);

    interface returnType {
        inspection_item_id: number;
        inspection_result_text: string;
        inspection_graphs: [];
    }

    //获取到检查项目信息
    const getInspectionTable = (val: returnType[]) => {
        // //console.log(val);
        form.setFieldValue('inspection_cases', val);
    }
    const getFileStatus = (val) => {
        setVideoReady(val);
    }

    const onFinish = (values) => {
        if (videoReady === false) {
            message.loading("视频未上传成功，请稍等！");
        } else {
            if (values.front_graph) {
                values.front_graph = values.front_graph[0]
            }
            //console.log(values);
            //console.log(JSON.stringify(values))
            fetch(`https://47.120.14.174:443/petHospital/cases/${caseData?.caseId}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Authorization": userInfo.data.result.token,
                },
                body: JSON.stringify(values)
            })
                .then((response) => response.json())
                .then((data) => {
                    //console.log(data);
                    let res = data.success;
                    if (res === true) {
                        message.success("修改成功！")
                        navigate(`/systemManage/case/detail/${caseData?.caseId}`, { replace: true })
                    }
                    else {
                        message.error("修改失败！")
                    }
                })
                .catch((err) => {
                    //console.log(err.message);
                });
        }

    }

    return (
        <Layout className='system-manage-content'>
            {
                form && caseData ? (
                    <>
                        <div style={{ textAlign: 'left' }}><BackButton /></div>
                        <div style={{ textAlign: 'left' }}>
                            <Form
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 14 }}
                                layout="horizontal"
                                style={{ maxWidth: '100%' }}
                                form={form} name="case_update"
                                onFinish={onFinish}
                            >
                                <Form.Item name="case_id" hidden={true} />
                                <Form.Item name="case_title" label="病例名称" rules={[{ required: true, message: '请输入病例名称！' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="front_graph" label="病例封面图">
                                    <ImageUpload num={1} mult={false} defaultImages={[caseData?.frontGraph]} />
                                </Form.Item>
                                <Form.Item name="disease_id" label="疾病名称" rules={[{ required: true, message: '请选择疾病名称！' }]}>
                                    <Select optionLabelProp="key"  >
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
                                    <ImageUpload num={8} mult={true} defaultImages={caseData?.admissionGraphList} />
                                </Form.Item>
                                <Form.Item name="inspection_cases" label="检查项目情况" >
                                    <InspectionTable getTable={getInspectionTable} inspection_list={caseData?.inspectionCaseList} />
                                </Form.Item>
                                <Form.Item name="diagnostic_result" label="诊断结果">
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item name="treatment_info" label="治疗方案">
                                    <TextArea rows={4} />
                                </Form.Item>
                                <Form.Item name="therapy_graphs" label="治疗方案图片" valuePropName="fileList">
                                    <ImageUpload num={8} mult={true} defaultImages={caseData?.treatmentGraphList} />
                                </Form.Item>
                                <Form.Item name="therapy_videos" label="治疗方案视频" >
                                    <VideoUpload defaultVideos={caseData?.treatmentVideoList} getFileStatus={getFileStatus} />
                                </Form.Item>
                                <div style={{ textAlign: 'center', marginTop: 50 }} >
                                    <Button type="primary" htmlType="submit">提交</Button>
                                </div>
                            </Form>
                        </div>
                    </>
                ) : (
                    <>
                        <Loading />
                    </>
                )
            }

        </Layout >


    );

}
export default CaseUpdate;