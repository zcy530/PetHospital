import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd';
import { cloneDeep } from 'lodash';
import { ColumnsType } from 'antd/es/table';
import ImageUpload from './imageUpload.tsx';

//返回给上层表单的类型
interface returnType {
    inspection_item_id: number;
    inspection_result_text: string;
    inspection_graphs: [];
}

//检查信息类型
interface InspectionType {
    inspection_item_id: number;
    inspection_name: string;
    inspection_result_text: string;
    inspection_graphs: [];
}

//显示在表格中的类型
interface TableDataType {
    id: number; //增加一个id用于锁定在表格当中的位置，防止同一个检查多个检查信息的情况
    inspection_item_id: number;
    inspection_name: string;
    inspection_result_text: string;
    inspection_graphs: [];
}

interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: InspectionType) => void;
    onCancel: () => void;
}

//定义弹窗表单类
const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
    open,
    onCreate,
    onCancel,
}) => {
    const [form] = Form.useForm();

    //这是select的onchange函数，用于把对应的name存储到表单当中
    const handleChange = (value: string[], e) => {
        // console.log(`selected ${value}`);
        // console.log(e.key)
        form.setFieldValue('inspection_name', e.key);
    };

    //处理多选框
    const [options, setOptions] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/petHospital/inspections/items' //获取所有检查项
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                // console.log(data.result);
                setOptions(data.result);
            })
            .catch((err) => {
                // console.log(err.message);
            });
    }, []);

    const { Option } = Select;

    return (
        <Modal
            open={open}
            title="添加一个检查"
            okText="确定"
            cancelText="取消"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        onCreate(values);
                        form.resetFields();
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
                <Form.Item name="inspection_item_id" label="检查名称">
                    <Select onChange={handleChange} optionLabelProp="key">
                        {options.map(item => (
                            <Option key={item.itemName} value={item.itemId}>{item.itemName}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="inspection_name" hidden={true}>
                </Form.Item>
                <Form.Item name="inspection_result_text" label="检查情况描述">
                    <Input type="textarea" />
                </Form.Item>
                <Form.Item name="inspection_graphs" label="检查情况图片" valuePropName="fileList">
                    <ImageUpload num={8} mult={true} />
                </Form.Item>
            </Form>
        </Modal>
    );
};


const InspectionTable = (props) => {
    const [open, setOpen] = useState(false);
    const [tableData, setTableData] = useState<TableDataType[]>([]);
    function deleteInspection(obj: TableDataType) {
        const data: TableDataType[] = tableData.filter((item: TableDataType) => item.id !== obj.id);
        setTableData(data);
        const formData: returnType[] = (data.map((item) => {
            return ({
                inspection_item_id: item.inspection_item_id,
                inspection_result_text: item.inspection_result_text,
                inspection_graphs: item.inspection_graphs
            });
        }));
        props.getTable(formData);
    }
    function addInspection(obj: InspectionType) {
        const addObj: TableDataType = {
            id: tableData.length
                ? tableData[tableData.length - 1]?.id + 1
                : 1,
            ...obj
        }
        const data: TableDataType[] = cloneDeep(tableData);
        data.push(addObj)
        setTableData(data);
        const formData: returnType[] = (data.map((item) => {
            return ({
                inspection_item_id: item.inspection_item_id,
                inspection_result_text: item.inspection_result_text,
                inspection_graphs: item.inspection_graphs
            });
        }));
        props.getTable(formData);
    }

    const onCreate = (values: InspectionType) => {
        // console.log('Received values of form: ', values);
        addInspection(values);
        setOpen(false);
    };

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
        <>
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

        </>

    )
};
export default InspectionTable;