import React, { useEffect, useRef, useState } from 'react';
import { InboxOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Space,
  Modal,
  Table,
  Layout,
  message,
} from 'antd';
import { Container } from 'react-bootstrap';
import { ColumnsType } from 'antd/es/table';

import { useForm } from 'antd/es/form/Form';
import VideoUpload from './videoUpload.tsx';
import InspectionTable from './inspectionTable.tsx';
import ImageUpload from './imageUpload.tsx';
import axios from 'axios';
import BackButton from "../../global/backButton.tsx";
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

interface returnType {
  inspection_item_id: number;
  inspection_result_text: string;
  inspection_graphs: [];
}


const CaseInsert: React.FC = () => {

  //处理多选框
  const [options, setOptions] = useState([]);
  useEffect(() => {
    fetch('https://47.120.14.174:443/petHospital/diseases'
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

  //处理表单，onFinish负责最后的提交
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = (values) => {
    if (values.front_graph) {
      values.front_graph = values.front_graph[0]
    }
    //console.log(values);
    //console.log(JSON.stringify(values))
    // var formData = new FormData(values);
    // //console.log(formData)
    fetch('https://47.120.14.174:443/petHospital/cases', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(values)
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        let res = data.success;
        if (res === true) {
          message.success("添加成功！")
          navigate(`/systemManage/case/detail/${data.result.caseId}`, { replace: true })
        }
        else fail();
      })
      .catch((err) => {
        //console.log(err.message);
      });
  }


  //获取到检查项目信息
  const getInspectionTable = (val: returnType[]) => {
    // //console.log(val);
    form.setFieldValue('inspection_cases', val);
  }


  return (
    <Layout className='system-manage-content'>
      <div style={{ textAlign: 'left' }}><BackButton /></div>
      <div style={{ textAlign: 'left' }}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: '100%' }}
          form={form} name="case_insert"
          onFinish={onFinish}
        >
          <Form.Item name="case_title" label="病例名称" rules={[{ required: true, message: '请输入病例名称！' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="front_graph" label="病例封面图">
            <ImageUpload num={1} mult={false} />
          </Form.Item>
          <Form.Item name="disease_id" label="疾病名称" rules={[{ required: true, message: '请选择疾病名称！' }]}>
            <Select optionLabelProp="key">
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
      </div>
    </Layout>
  );
};


export default () => <CaseInsert />;
