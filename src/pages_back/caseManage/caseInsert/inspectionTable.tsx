import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Table, Image } from 'antd';
import { cloneDeep } from 'lodash';
import { ColumnsType } from 'antd/es/table';
import ImageUpload from './imageUpload.tsx';
import { useSelector } from 'react-redux';

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
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    //这是select的onchange函数，用于把对应的name存储到表单当中
    const handleChange = (value: string[], e) => {
        // console.log(`selected ${value}`);
        // console.log(e.key)
        form.setFieldValue('inspection_name', e.key);
    };

    //处理多选框
    const [options, setOptions] = useState([]);
    useEffect(() => {
        fetch('https://47.120.14.174:443/petHospital/inspections/items', {//获取所有检查项
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        })
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
                <Form.Item name="inspection_item_id" label="检查名称" rules={[{ required: true, message: '请选择检查名称！' }]}>
                    <Select onChange={handleChange} optionLabelProp="key">
                        {options.map(item => (
                            <Option key={item.itemName} value={item.itemId}>{item.itemName}</Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="inspection_name" hidden={true}>
                </Form.Item>
                <Form.Item name="inspection_result_text" label="检查情况描述" rules={[{ required: true, message: '请输入检查情况！' }]}>
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
    // console.log(props.value)
    const [open, setOpen] = useState(false);
    const [tableData, setTableData] = useState<TableDataType[]>([]);

    useEffect(() => {
        if (props.value) {
            const inspection_list: TableDataType[] = props.value.map((item, i) => {
                return {
                    id: i, //增加一个id用于锁定在表格当中的位置，防止同一个检查多个检查信息的情况
                    inspection_item_id: item.inspectionItem?.itemId,
                    inspection_name: item.inspectionItem?.itemName,
                    inspection_result_text: item.result,
                    inspection_graphs: item.inspectionGraphs?.map(item1 => { return item1.url })
                }
            })
            setTableData(inspection_list);
            const formData: returnType[] = (inspection_list.map((item) => {
                return ({
                    inspection_item_id: item.inspection_item_id,
                    inspection_result_text: item.inspection_result_text,
                    inspection_graphs: item.inspection_graphs
                });
            }));
            props.getTable(formData);
            // console.log(tableData)
        }
    }, []);

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
            title: '检查图片',
            dataIndex: 'inspection_graphs',
            render: (_, record) => (
                <div>
                    {record.inspection_graphs?.map((item, i) => (
                        <Image
                            width={100} height={100}
                            src={item}
                        />
                    ))}
                </div>
            ),
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