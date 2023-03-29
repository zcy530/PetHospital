import React, { useState } from 'react';
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
} from 'antd';
import { Container } from 'react-bootstrap';
import { ColumnsType } from 'antd/es/table';
import { cloneDeep } from 'lodash';

const { TextArea } = Input;

interface InspectionType {
  name: string;
  description: string;
  imgs: [];
}

interface DataType {
  id: number;
  name: string;
  description: string;
  imgs: [];
}

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: InspectionType) => void;
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
      title="添加一个检查"
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(async values => {
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
        <Form.Item name="name" label="检查名称">
          <Select>
            <Select.Option value="血常规检查">血常规检查</Select.Option>
            <Select.Option value="检查2">检查2</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="description" label="检查情况描述">
          <Input type="textarea" />
        </Form.Item>
        <Form.Item name="imgs" label="检查情况图片" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
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



  const [tableData, setTableData] = useState<DataType[]>([]);
  function deleteInspection(obj: DataType) {
    const data: DataType[] = tableData.filter((item: DataType) => item.id !== obj.id);
    // const data:DataType[]=cloneDeep(tableData);
    // data.splice(obj.id,1,"")
    // console.log("list"+data.length);
    // console.log("tabledata"+tableData.length);
    // list.splice(obj.id,1);
    setTableData(data);
  }
  function addInspection(obj: InspectionType) {
    const addObj: DataType = {
      id: tableData.length
        ? tableData[tableData.length - 1]?.id + 1
        : 1,
      ...obj
    }
    const data: DataType[] = cloneDeep(tableData);
    data.push(addObj)
    setTableData(data)
  }

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    //todo:add inspection
    addInspection(values)
    setOpen(false);
  };

  // 定义检查项目表中的列
  const columns: ColumnsType<DataType> = [
    {
      title: '检查名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '检查情况',
      dataIndex: 'description',
      key: 'description',

    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <MinusCircleOutlined onClick={() => deleteInspection(record)} />
        </Space>
      ),
    },
  ];



  return (
    <Container style={{ width: '100%', height: '100%' }}>
      <div style={{ textAlign: 'left', backgroundColor: 'white', padding: 50, borderRadius: 10 }}>
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: '100%', marginLeft: 100 }}
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
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label="检查项目情况">

            <div className='inspection_box' >
              <Table columns={columns} dataSource={tableData} rowKey="id" pagination={false} scroll={{ y: 300 }} />
            </div>

            <div style={{ marginTop: 10 }}>
              <Button
                type="primary"
                onClick={() => {
                  setOpen(true);
                }}
              >
                新增检查项目
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
                <div style={{ marginTop: 8 }}>Upload</div>
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
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Button type="primary" >提交</Button>
      </div>

    </Container>
  );
};


export default () => <CaseInsert />;
