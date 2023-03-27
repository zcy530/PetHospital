import React, { useState } from 'react';
import { InboxOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Upload,
  Row,
  Col,
  Space,
  Modal,
} from 'antd';
import { Container } from 'react-bootstrap';
import { left } from '@popperjs/core';

const { TextArea } = Input;

interface Values {
    title: string;
    description: string;
    modifier: string;
  }
  
  interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: Values) => void;
    onCancel: () => void;
  }

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
  }) => {
    const [form] = Form.useForm();
    return (
      <Modal
        open={open}
        title="Create a new collection"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title of collection!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input type="textarea" />
          </Form.Item>
          <Form.Item name="modifier" className="collection-create-form_last-form-item">
            <Radio.Group>
              <Radio value="public">Public</Radio>
              <Radio value="private">Private</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  };



const CaseInsert: React.FC = () => {
    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
        return e;
        }
        return e?.fileList;
    };

    const [open, setOpen] = useState(false);

    const onCreate = (values: any) => {
      console.log('Received values of form: ', values);
      setOpen(false);
    };

  return (
    <Container style={{width: '100%', height:'100%'}}>
        <div style={{textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius:10}}>
        <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: '100%', marginLeft: 100}}
      >
        <Form.Item label="病例名称">
          <Input />
        </Form.Item>
        <Form.Item label="疾病名称">
          <Select>
            <Select.Option value="demo1">传染病</Select.Option>
            <Select.Option value="demo2">寄生虫病1</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="接诊信息">
            <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="接诊图片" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8}}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="检查项目情况">
            <Form.List name="users">
                {(fields, { add, remove }) => (
                    <>
                    {fields.map(({ key, name, ...restField }) => (
                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                        <Form.Item
                            {...restField}
                            name={[name, 'first']}
                            rules={[{ required: true, message: 'Missing first name' }]}
                        >
                            <div>1111111111</div>
                        </Form.Item>
                        <Form.Item
                            {...restField}
                            name={[name, 'last']}
                            rules={[{ required: true, message: 'Missing last name' }]}
                        >
                            <div>22222222222</div>
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                    ))}
                    <Form.Item>
                        <Button 
                            type="dashed" 
                            onClick={() =>{ 
                            setOpen(true); 
                            add();
                            }} 
                            block icon={<PlusOutlined />}>
                        Add field
                        </Button>
                        <CollectionCreateForm
                            open={open}
                            onCreate={onCreate}
                            onCancel={() => {
                                setOpen(false);
                            }}
                        />
                    </Form.Item>
                    </>
                )}
            </Form.List>


            <div>
                <Button
                    type="primary"
                    onClick={() => {
                    setOpen(true);
                    }}
                >
                    New Collection
                </Button>
                <CollectionCreateForm
                    open={open}
                    onCreate={onCreate}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            </div>
           
        </Form.Item>
        <Form.Item label="诊断结果">
            <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="治疗方案">
            <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="治疗方案图片" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8}}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item label="治疗方案视频">
            <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                <Upload.Dragger name="files" action="/upload.do">
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                </Upload.Dragger>
            </Form.Item>
        </Form.Item>
        
      </Form>

        </div>
        <div style={{textAlign: 'center', marginTop: 50}}>
            <Button >提交</Button>
        </div>
      
    </Container>
  );
};


export default () => <CaseInsert />;
