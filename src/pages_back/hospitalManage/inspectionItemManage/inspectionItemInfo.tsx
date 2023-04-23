// 疫苗管理的界面
import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Select, Form, InputRef, Space, Table, Modal, message, InputNumber } from 'antd';
import { ColumnsType } from "antd/es/table";
import { DeleteTwoTone, SearchOutlined, EditTwoTone, ExclamationCircleFilled, MedicineBoxTwoTone, BookTwoTone } from '@ant-design/icons';
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';
import { InspectionItemType } from "./inspectionItemType.tsx";
import TextArea from "antd/es/input/TextArea";


//------------------------------------------
interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: InspectionItemType) => void;
    onCancel: () => void;
}

interface CollectionEditFormProps {
    open: boolean;
    record: InspectionItemType;
    onCreate: (values: InspectionItemType) => void;
    onCancel: () => void;
}

interface department {
    id: number,
    text: string,
    value: string
}

const { Option } = Select;

const InspectionInfo: React.FC = () => {
    //定义表格数据使用
    const [inspectionData, setInspectionData] = useState<InspectionItemType[]>([]);
    //count监听变化
    const [count, setCount] = useState(0);
    const [departmentList, setDepartmentList] = useState<department[]>([]);

    useEffect(() => {
        getAllDepartment();
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/inspections'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                setInspectionData(data.result);
                //设置posts值为data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [count]);

    const getAllDepartment = () => {
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/departments'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                let list: department[] = [];
                data.result.map(res => {
                    list.push({ "id": res.departmentId, "text": res.departmentName, "value": res.departmentName })
                })
                setDepartmentList(list)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    //定义两个变量 一个对应创建的窗口 一个对应编辑的窗口
    const [createFormOpen, setCreateFormOpen] = useState(false);
    const [editFormOpen, setEditFormOpen] = useState(false);
    //editRecord用于记录点击的record的信息，传给编辑窗口
    const [editRecord, setEditRecord] = useState<InspectionItemType>({});

    const onCreate = (values: any) => {
        console.log('Received values of form: ', values);
        setCreateFormOpen(false);
        setEditFormOpen(false);
    };

    //新增操作
    const addItem = () => {
        setCreateFormOpen(true);
    }

    //新建项目的表单
    const ItemCreateForm: React.FC<CollectionCreateFormProps> = ({
        open,
        onCreate,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        return (
            //用Modal弹出表单
            <Modal
                open={open} //是
                title="添加检查项目信息"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                            fetch('https://47.120.14.174:443/petHospital/inspections', {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                },
                                body: JSON.stringify({
                                    "inspectionItemId": 0,
                                    "fee": values.fee,
                                    "intro": values.intro,
                                    "itemName": values.itemName,
                                    "departmentId": values.departmentId
                                })
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    console.log(data);
                                    let res = data.success;
                                    if (res === true) {
                                        message.success("添加成功！");
                                        setCount(count + 1);
                                    }
                                    else {
                                        message.error("添加失败，请稍后再试！");
                                    }
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                });
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
                        name="itemName"
                        label="检查项目名称"
                        rules={[{ required: true, message: '请输入检查项目名称！' }]}
                    >
                        <Input placeholder="Inspection name" />
                    </Form.Item>
                    <Form.Item name="intro" label="检查项目简介"
                        rules={[{ required: true, message: '请输入检查项目简介！' }]}
                    >
                        <TextArea placeholder="Introduction" rows={3} />
                    </Form.Item>
                    <Form.Item name="departmentId" label="相关科室"
                        rules={[{ required: true, message: '请选择相关科室！' }]}
                    >
                        <Select placeholder="department">
                            {
                                departmentList.map(department => (
                                    <Option value={department.id}>{department.text}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="fee" label="费用"
                        rules={[{ required: true, message: '请输入检查项目费用！' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                </Form>
            </Modal>
        )
    };

    //编辑操作
    const editItem = () => {
        //跳出编辑的对话框
        setEditFormOpen(true);
    };

    const ItemEditForm: React.FC<CollectionEditFormProps> = ({
        open,
        record,
        onCreate,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        //set field value
        form.setFieldValue("itemName", record.itemName);
        form.setFieldValue("departmentId", record.departmentId);
        form.setFieldValue("intro", record.intro);
        form.setFieldValue("fee", record.fee);

        return (
            //用Modal弹出表单
            <Modal
                open={open} //是
                title="修改疫苗信息"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                            fetch(`https://47.120.14.174:443/petHospital/inspections/` + record.inspectionItemId, {
                                method: 'PUT',
                                body: JSON.stringify({
                                    "inspectionItemId": record.imspectionItemId,
                                    "fee": values.fee,
                                    "intro": values.intro,
                                    "itemName": values.itemName,
                                    "departmentId": values.departmentId
                                }),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                }
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    console.log(data)
                                    // 获取实际修改的数目
                                    if (data.success === true) {
                                        let res = data.result.modifiedRecordCount;
                                        console.log(res)
                                        if (res === 1) {
                                            message.success("修改成功！");
                                            setCount(count + 1); //数据页面更新
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
                                    console.log(err.message);
                                });
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
                        name="itemName"
                        label="检查项目名称"
                        rules={[{ required: true, message: '请输入检查项目名称！' }]}
                    >
                        <Input placeholder="Inspection name" />
                    </Form.Item>
                    <Form.Item name="intro" label="检查项目简介"
                        rules={[{ required: true, message: '请输入检查项目简介！' }]}
                    >
                        <TextArea placeholder="Introduction" rows={3} />
                    </Form.Item>
                    <Form.Item name="departmentId" label="相关科室"
                        rules={[{ required: true, message: '请选择相关科室！' }]}
                    >
                        <Select placeholder="department">
                            {
                                departmentList.map(department => (
                                    <Option value={department.id}>{department.text}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item name="fee" label="费用"
                        rules={[{ required: true, message: '请输入检查项目费用！' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                </Form>
            </Modal>
        )
    };

    //表格列搜索功能
    //列的下标
    type DataIndex = keyof InspectionItemType;

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
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
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<VaccineType> => ({
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

    //删除
    const del = (id: number) => {
        //弹出对话框 是否删除？
        showDeleteConfirm(id);
    }

    const { confirm } = Modal;
    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该检查项目吗？',
            icon: <ExclamationCircleFilled />,
            // content: '用户id为:' + id,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                fetch(`https://47.120.14.174:443/petHospital/inspections/${id}`, {
                    method: 'DELETE',
                }).then(
                    (response) => response.json()
                ).then((data) => {
                    if (data.status === 200) {
                        console.log('删除成功！')
                        //返回删除成功的提示
                        message.success("删除成功！")
                        setCount(count + 1)
                    } else { //status===409 有关关联的病例
                        console.log('删除失败！')
                        message.error(data.message)
                    }
                }).catch(e => {
                    console.log('错误:', e)
                    message.error("删除失败，请重试！")
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    //分页默认值，记得import useState
    const [pageOption, setPageOption] = useState({
        pageNo: 1,  //当前页为1
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
            pageSize: size,  //一页有几行
        })
    }

    // 定义列
    const columns: ColumnsType<InspectionItemType> = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => `${(pageOption.pageNo - 1) * pageOption.pageSize + (index + 1)}`,
            align: 'center',
            width: '10%'
        },
        {
            title: '名称',
            dataIndex: 'itemName',
            align: 'center',
            // width: '50%',
            // 该列添加搜索功能
            ...getColumnSearchProps('itemName'),
        },
        {
            title: '简介',
            dataIndex: 'intro',
            align: 'center',
            width: '30%',
        },
        {
            title: '相关科室',
            dataIndex: 'departmentName',
            align: 'center',
            width: '20%',
            // 该列添加筛选功能
            filters: departmentList,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (text: string, record) => record.departmentName.startsWith(text),
        },
        {
            title: '费用',
            dataIndex: 'fee',
            align: 'center',
             // sort 
             sorter: (a, b) => (a.fee > b.fee) ? 1 : -1,
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <EditTwoTone onClick={() => {
                        console.log(record)
                        //这一行的数据赋值给editRecord
                        setEditRecord(record)
                        editItem();
                    }
                    } />
                    <DeleteTwoTone onClick={() => {
                        del(record.inspectionItemId)
                    }} />

                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ textAlign: 'right', margin: 16 }}>
                <Button type="primary" ghost onClick={addItem}>新增检查项目</Button>
            </div>

            {/* 新建疫苗的表单 open为true时弹出 */}
            <ItemCreateForm
                open={createFormOpen}
                onCreate={onCreate}
                onCancel={() => {
                    setCreateFormOpen(false);
                }} />

            {/* 编辑疫苗的表单 open为true时弹出 */}
            <ItemEditForm
                open={editFormOpen}
                record={editRecord}
                onCreate={onCreate}
                onCancel={() => {
                    setEditFormOpen(false);
                }} />

            <Table columns={columns} dataSource={inspectionData} style={{ margin: 16 }} pagination={paginationProps} />
        </div >
    );
}

export default InspectionInfo;