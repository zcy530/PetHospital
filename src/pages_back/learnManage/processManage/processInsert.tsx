import { Form, Input, Layout, Image, Button, List, Space, Modal, message } from "antd";

import { MenuOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { useForm } from 'antd/es/form/Form';
import React, { useState } from "react";
import { OperationType } from "./processType.tsx";
import { cloneDeep } from 'lodash';
import ImageUpload from "../../caseManage/caseInsert/imageUpload.tsx";
import { useNavigate } from "react-router-dom";
import BackButton from "../../global/backButton.tsx";
import { useSelector } from "react-redux";



const { TextArea } = Input;



//处理拖拽部分
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    'data-row-key': string;
}

const Row = ({ children, ...props }: RowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });


    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 })?.replace(
            /translate3d\(([^,]+),/,
            'translate3d(0,',
        ),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
    };

    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
                if ((child as React.ReactElement).key === 'sort') {
                    return React.cloneElement(child as React.ReactElement, {
                        children: (
                            <MenuOutlined
                                ref={setActivatorNodeRef}
                                style={{ touchAction: 'none', cursor: 'move' }}
                                {...listeners}
                            />
                        ),
                    });
                }
                return child;
            })}
        </tr>
    );
};

//定义弹窗表单类
interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: OperationType) => void;
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
            title="添加一个操作"
            okText="确定"
            cancelText="取消"
            zIndex={10000} //覆盖掉下面的表格，下面表格为空时z-index为9999
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
                <Form.Item name="operationName" label="操作名称" rules={[{ required: true, message: '请输入操作名称！' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="intro" label="操作说明">
                    <TextArea rows={2} />
                </Form.Item>
                <Form.Item name="url" label="操作情况图片" valuePropName="fileList">
                    <ImageUpload num={1} mult={false} />
                </Form.Item>
            </Form>
        </Modal>
    );
};


const ProcessInsert = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    const [count, setCount] = useState(3);
    const [open, setOpen] = useState(false);
    const [dataSource, setDataSource] = useState<OperationType[]>([
        // {
        //     key: 1,
        //     operationName: "问候客人",
        //     intro: "前台工作人员首先要礼貌地问候客人，确认他们需要帮助的事情是什么。",
        //     url: "https://pet-hospital-back-end-picture.oss-cn-shanghai.aliyuncs.com/process/27.png",
        //     sortNum: 1
        // },
        // {
        //     key: 2,
        //     operationName: "填写登记信息",
        //     intro: "工作人员需要为病人填写登记表格，包括病人的姓名、宠物的种类和病情等信息。",
        //     url: "https://pet-hospital-back-end-picture.oss-cn-shanghai.aliyuncs.com/process/28.png",
        //     sortNum: 2
        // }
    ]);

    function deleteOperation(obj: OperationType) {
        const data: OperationType[] = dataSource.filter((item: OperationType) => item.key !== obj.key);
        for (let i = 0; i < data.length; i++) {
            data[i].sortNum = i + 1;
        }
        setDataSource(data);
        form.setFieldValue("operationList", data);
    }

    function addOperation(obj) {
        const addObj: OperationType = {
            key: count + 1,
            sortNum: -1,
            ...obj
        }
        const data: OperationType[] = cloneDeep(dataSource);
        // console.log(addObj)
        data.push(addObj)
        for (let i = 0; i < data.length; i++) {
            data[i].sortNum = i + 1;
        }
        setCount(count + 1);
        // console.log(count);
        setDataSource(data);
        form.setFieldValue("operationList", data);
    }

    const onCreate = (values: OperationType) => {
        // console.log('Received values of form: ', values);
        addOperation(values)
        setOpen(false);
    };


    const columns: ColumnsType<OperationType> = [
        {
            key: 'sort',
            //用于拖拽调整位置辨别条目
        },
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
        },
        {
            title: '删除',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <MinusCircleOutlined onClick={() => deleteOperation(record)} />
                </Space>
            ),
        }
    ];

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        // console.log(active.id)
        // console.log(over)
        // console.log(over?.id)
        if (active.id !== over?.id) {
            const previous = dataSource;
            const activeIndex = previous.findIndex((i) => i.key === active.id);
            const overIndex = previous.findIndex((i) => i.key === over?.id);
            const list = arrayMove(previous, activeIndex, overIndex);
            // console.log(dataSource);
            for (let i = 0; i < list.length; i++) {
                list[i].sortNum = i + 1;
            }
            setDataSource(list);
        }

    };


    const [form] = useForm();
    const navigate = useNavigate();
    function onFinish(values: any): void {
        // console.log(values)
        if (dataSource) {
            values.operationList = (dataSource.map((item) => {
                return ({
                    sortNum: item.sortNum,
                    operationName: item.operationName,
                    intro: item.intro,
                    url: item.url ? item.url[0] : "",
                }
                );
            }));
        } else {
            values.operationList = [];
        }

        // console.log(values)
        // console.log(JSON.stringify(values))
        fetch('https://47.120.14.174:443/petHospital/processes', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                "Authorization": userInfo.data.result.token,
            },
            body: JSON.stringify(values)
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                let res = data.success;
                if (res === true) {
                    message.success("添加成功！")
                    navigate(`/systemManage/process/detail/${data.result.processId}`, { replace: true })
                }
                else {
                    message.error("添加失败！")
                }
            })
            .catch((err) => {
                console.log(err.message);
            });

    }
    return (
        <Layout className='system-manage-content'>
            <div style={{ textAlign: 'left' }}><BackButton /></div>
            <div style={{ textAlign: 'left' }}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                    style={{ maxWidth: '100%' }}
                    form={form} name="process_insert"
                    onFinish={onFinish}
                >
                    <Form.Item name="processName" label="流程名称" rules={[{ required: true, message: '请输入流程名称！' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="intro" label="流程描述">
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item name="operationList" label="操作列表" rules={[{ required: true, message: '请至少添加一个操作！' }]}>
                        <DndContext onDragEnd={onDragEnd}>
                            <SortableContext
                                // rowKey array
                                items={dataSource.map((i) => i.key)}
                                strategy={verticalListSortingStrategy}
                            >
                                <Table
                                    components={{
                                        body: {
                                            row: Row,
                                        },
                                    }}
                                    rowKey="key"
                                    columns={columns}
                                    dataSource={dataSource}
                                    pagination={false}
                                />
                            </SortableContext>
                        </DndContext>
                        < div style={{ marginTop: 10 }}>
                            <Button
                                type="primary"
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                新增操作
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

                    <div style={{ textAlign: 'center', marginTop: 50 }} >
                        <Button type="primary" htmlType="submit">提交</Button>
                    </div>
                </Form>
            </div>
        </Layout >
    );
};

export default ProcessInsert;