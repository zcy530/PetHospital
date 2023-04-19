//药品管理界面
import React, { useEffect, useRef, useState } from "react";
import { Button, Descriptions, Form, Input, InputNumber, InputRef, Modal, Space, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { DeleteTwoTone, SearchOutlined, EditTwoTone, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';
import { MedicineType } from "./medicineType.tsx";
import ImageUpload from "../../caseManage/caseInsert/imageUpload.tsx";

const { TextArea } = Input;

const MedicineInfo: React.FC = () => {
    //分页默认值，记得import useState
    const [pageOption, setPageOption] = useState({
        pageNo: 1,  //当前页为1
        pageSize: 10, //一页10行
    })

    //分页配置
    const paginationProps = {
        current: pageOption.pageNo,
        pageSize: pageOption.pageSize,
        onChange: (current, size) => paginationChange(current, size)
    }

    //当翻页时，改变当前为第current页，current和size这两参数是onChange API自带的，会帮你算出来你现在在第几页，这一页有多少行数据。
    const paginationChange = async (current, size) => {
        //前面用到useState
        setPageOption({
            pageNo: current, //当前所在页面
            pageSize: size,  //一页有几行
        })
    }


    //定义表格数据使用
    const [medicineData, setMedicineData] = useState<MedicineType[]>([]);
    //用于更新表格数据
    const [count, setCount] = useState(0);

    useEffect(() => {
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/drugs'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                //console.log(data.result);
                setMedicineData(data.result);
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, [count]);

    //表格列搜索功能
    //列的下标
    type DataIndex = keyof MedicineType;

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');


    const [createFormOpen, setCreateFormOpen] = useState(false);
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<MedicineType>();
    // 搜索输入框
    const searchInput = useRef<InputRef>(null);

    //处理搜索的函数
    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    //重置搜索框
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    //获取列
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<MedicineType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        //渲染搜索框页面
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });




    interface CollectionCreateFormProps {
        open: boolean;
        onCreate: () => void;
        onCancel: () => void;
    }

    const onCreate = () => {
        setCreateFormOpen(false);
        setEditFormOpen(false);
    };

    //新增操作
    const addMedicine = () => {
        setCreateFormOpen(true); //设置open为true，用于弹出弹出填写用户信息的表单
    }

    //创建药品的表单
    const MedicineCreateForm: React.FC<CollectionCreateFormProps> = ({
        open,
        onCreate,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        return (
            //用Modal弹出表单
            <Modal
                open={open} //是
                title="创建新药品"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate();
                            values.url = values.url[0];
                            fetch('https://47.120.14.174:443/petHospital/drugs', {
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
                                        message.success("添加成功！");
                                        const newMedicindata = [...medicineData, values];
                                        setMedicineData(newMedicindata);
                                    }
                                    else {
                                        message.error("添加失败，请稍后再试！");
                                    }
                                })
                                .catch((err) => {
                                    //console.log(err.message);
                                });
                        })
                        .catch((info) => {
                            //console.log('Validate Failed:', info);
                        });
                }}
            >
                {/* {contextHolder} */}
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                >
                    <Form.Item
                        name="name"
                        label="药品名称"
                        rules={[{ required: true, message: '请输入药品名称！' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="intro" label="药品简介"
                    // rules={[{ required: true, message: '请输入药品简介！' }]}
                    >
                        <TextArea cols={2} />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="药品类型"
                        rules={[{ required: true, message: '请输入药品类型！' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="药品价格"
                        rules={[{ required: true, message: '请输入药品价格！' }]}
                    >
                        <InputNumber addonAfter={<text>￥</text>} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="url" label="药品图片" rules={[{ required: true, message: '请上传药品图片！' }]}>
                        <ImageUpload num={1} mult={false} />
                    </Form.Item>
                </Form>
            </Modal>
        )
    };

    //编辑操作
    const edit = (id: number) => {
        //console.log("点击编辑id为" + id);
        //跳出编辑的对话框
        setEditFormOpen(true); //设置open为true，用于弹出弹出修改用户信息的表单
    };

    const MedicineEditForm: React.FC<CollectionCreateFormProps> = ({
        open,
        onCreate,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        //set field value
        form.setFieldsValue(editRecord);
        //console.log(editRecord)
        return (
            //用Modal弹出表单
            <Modal
                open={open} //是
                title="修改药品信息"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate();
                            //console.log(values)
                            values.url = values.url[0];
                            //console.log(values)
                            //console.log(JSON.stringify(values))
                            fetch(`https://47.120.14.174:443/petHospital/drugs/${editRecord?.id}`, {
                                method: 'PUT',
                                body: JSON.stringify(values),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    //console.log(data)
                                    if (data.success === true) {
                                        let res = data.result.modifiedRecordCount;
                                        //console.log(res)
                                        if (res === 1) {
                                            message.success("修改成功！");
                                            setCount(count + 1);
                                        }
                                        else {
                                            message.error("修改失败，请稍后再试！")
                                        }
                                    } else {
                                        message.error("修改失败，请稍后再试！")
                                    }

                                })
                                .catch((err) => {
                                    message.error("修改失败，请稍后再试！")
                                    //console.log(err.message);
                                });
                        })
                        .catch((info) => {
                            //console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                >
                    <Form.Item name="id" hidden={true} />
                    <Form.Item
                        name="name"
                        label="药品名称"
                        rules={[{ required: true, message: '请输入药品名称！' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="intro" label="药品简介"
                    // rules={[{ required: true, message: '请输入药品简介！' }]}
                    >
                        <TextArea cols={2} />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="药品类型"
                        rules={[{ required: true, message: '请输入药品类型！' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="药品价格"
                        rules={[{ required: true, message: '请输入药品价格！' }]}
                    >
                        <InputNumber addonAfter={<text>￥</text>} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="url" label="药品图片" rules={[{ required: true, message: '请上传药品图片！' }]}>
                        <ImageUpload num={1} mult={false} defaultImages={[editRecord?.url]} />
                    </Form.Item>
                </Form>
            </Modal>
        )
    };


    //删除药品
    const del = (id: number) => {
        //弹出对话框 是否删除？
        showDeleteConfirm(id);
    }

    const { confirm } = Modal;
    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该药品吗？',
            icon: <ExclamationCircleFilled />,
            // content: '用户id为:' + id,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                //console.log('OK');
                fetch(`https://47.120.14.174:443/petHospital/drugs/${id}`, {
                    method: 'DELETE',
                }).then((response) => {
                    if (response.status === 200) {
                        //console.log('删除成功！')
                        message.success("操作成功！");
                        //删除的事件 DELETE
                        setMedicineData(medicineData.filter((item) => { return item.id !== id }));
                        //返回删除成功的提示
                    } else {
                        //console.log('删除失败！')
                        message.error("操作失败，请重试！");
                    }
                }).catch(e => {
                    //console.log('错误:', e)
                    fail()
                });
            },
            onCancel() {
                //console.log('Cancel');
            },
        });
    };



    // 定义列
    const columns: ColumnsType<MedicineType> = [
        {
            title: '序号',
            width: '10%',
            render: (text, record, index) => `${(pageOption.pageNo - 1) * pageOption.pageSize + (index + 1)}`,
            align: 'center',
        },
        {
            title: '名称',
            dataIndex: 'name',
            align: 'center',
            // width: '50%',
            // 该列添加搜索功能
            ...getColumnSearchProps('name'),
        },
        {
            title: '简介',
            dataIndex: 'intro',
            align: 'center',
            width: '30%',
        },
        {
            title: '类别',
            dataIndex: 'type',
            align: 'center',
            // width: '50%',
            // 该列添加搜索功能
            ...getColumnSearchProps('type'),
            render: (text, record) => (
                <Tag color='green'>
                    {text}
                </Tag>
            ),
        },
        {
            title: '价格',
            dataIndex: 'price',
            align: 'center',
            // width: '50%',
            // 该列添加sort
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/systemManage/medicine/detail/${record.id}`}
                        state={{ record: record }}
                    >
                        <EyeOutlined />
                    </Link>
                    <EditTwoTone onClick={() => {
                        edit(record.id);
                        setEditRecord(record);
                    }} />
                    <DeleteTwoTone onClick={() => {
                        del(record.id)
                    }} />

                </Space>
            ),
        },
    ];




    return (
        <div>
            <div style={{ textAlign: 'right', margin: 16 }}>
                <Space wrap>
                    <Button type="primary" ghost onClick={addMedicine}>新增药品</Button>
                </Space>
            </div>
            {/* 创建药品的表单 open为true时弹出 */}
            <MedicineCreateForm
                open={createFormOpen}
                onCreate={onCreate}
                onCancel={() => {
                    setCreateFormOpen(false);
                }} />

            {/* 编辑药品的表单 open为true时弹出 */}
            <MedicineEditForm
                open={editFormOpen}
                onCreate={onCreate}
                onCancel={() => {
                    setEditFormOpen(false);
                }} />

            <Table columns={columns} dataSource={medicineData} style={{ margin: 16 }} pagination={paginationProps} />
        </div >
    );
}

export default MedicineInfo;