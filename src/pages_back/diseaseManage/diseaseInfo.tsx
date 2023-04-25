import React, { useEffect, useRef, useState } from 'react'
import { Input, InputRef, Space, Button, Modal, Form, Table, Select, message } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { DeleteTwoTone, EditTwoTone, SearchOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { DiseaseInfo, diseaseOption, getCategoryList } from './diseaseType.tsx'
import Loading from '../global/loading.tsx'
import { useSelector } from 'react-redux';

type DataIndex = keyof DiseaseInfo;
const { Option } = Select;

//创建表单的接口
interface CollectionCreateFormProps {
    open: boolean;
    onCreate: (values: DiseaseInfo) => void;
    onCancel: () => void;
}

interface CollectionEditFormProps {
    open: boolean;
    record: DiseaseInfo;
    onCreate: (values: DiseaseInfo) => void;
    onCancel: () => void;
}

const DiseaseManage: React.FC = () => {
    const userLogin = useSelector(state => state.userLogin)
    const token = userLogin.userInfo.data.result.token;
    const [createOpenForm, setCreateFormOpen] = useState(false);
    const [editFormOpen, setEditFormOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<DiseaseInfo>([]);
    const [diseaseCategory, setDiseaseCategory] = useState<diseaseOption[]>([]);

    const onCreate = (values: any) => {
        console.log('Received values of form: ', values);
        setCreateFormOpen(false);
        setEditFormOpen(false);
    };

    const DiseaseCreateForm: React.FC<CollectionCreateFormProps> = ({
        open,
        onCreate,
        onCancel,
    }) => {

        const [form] = Form.useForm();
        return (
            <Modal
                open={open}
                title="创建新病种"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                            console.log(values.diseaseName + ' ' + values.typeName)
                            fetch('https://47.120.14.174:443/petHospital/diseases', {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                    'Authorization': token
                                },
                                body: JSON.stringify({
                                    "diseaseName": values.diseaseName,
                                    "typeName": values.typeName,
                                })
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    console.log(values)
                                    console.log(data);
                                    let res = data.success;
                                    if (res === true) { //成功新增
                                        message.success("添加成功！")
                                        setCount(count + 1);
                                    }
                                    else message.error("添加失败，请稍后再试！")
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
                        name="diseaseName"
                        label="填写病种名称"
                        rules={[{ required: true, message: 'Please input the title of disease!' }]}
                    >
                        <Input placeholder="病种" />
                    </Form.Item>
                    <Form.Item
                        name="typeName"
                        label="疾病类别"
                        rules={[{ required: true, message: 'Please select the type of disease!' }]}
                    >
                        <Select placeholder="选择疾病类别">
                            {/* 循环遍历渲染数组对象 */}
                            {
                                diseaseCategory.map(disease => (
                                    <Option value={disease.text}>{disease.text}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
        );
    };

    const DiseaseEditForm: React.FC<CollectionEditFormProps> = ({
        open,
        record,
        onCreate,
        onCancel,
    }) => {

        const [form] = Form.useForm();
        return (
            <Modal
                open={open}
                title="修改病种"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                            console.log(values.diseaseName + ' ' + values.typeName)
                            fetch('https://47.120.14.174:443/petHospital/diseases/' + record.diseaseId, {
                                method: 'PUT',
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                    'Authorization': token
                                },
                                body: JSON.stringify({
                                    "diseaseId": record.diseaseId,
                                    "diseaseName": values.diseaseName,
                                    "typeName": values.typeName,
                                })
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    // console.log(values)
                                    console.log(data);
                                    let res = data.result.modifiedRecordCount;
                                    console.log(res);
                                    if (res === 1) {
                                        message.success("修改成功！")
                                        setCount(count + 1); //数据页面更新
                                    }
                                    else message.error("修改失败，请稍后再试！")
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
                        name="diseaseName"
                        label="填写病种名称"
                        rules={[{ required: true, message: 'Please input the title of disease!' }]}
                    >
                        <Input placeholder={record.diseaseName} />
                    </Form.Item>
                    <Form.Item
                        name="typeName"
                        label="疾病类别"
                        rules={[{ required: true, message: 'Please select the type of disease!' }]}
                    >
                        <Select placeholder={record.typeName}>
                            {/* 循环遍历渲染数组对象 */}
                            {
                                diseaseCategory.map(disease => (
                                    <Option value={disease.value}>{disease.text}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>
        );
    };

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

    //重置
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    //获取列
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DiseaseInfo> => ({
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

    //获取全部病种数据
    const [diseaseData, setDiseaseData] = useState<DiseaseInfo[]>([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        setDiseaseCategory(getCategoryList(token))
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/diseases',
            { headers: { 'Authorization': token } }
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                setDiseaseData(data.result);
                //设置posts值为data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [count]);

    //增加
    const addDisease = () => {
        setCreateFormOpen(true); //设置open为true，用于弹出弹出填写用户信息的表单
    }

    //编辑
    const edit = (record: DiseaseInfo) => {
        //跳出编辑的对话框
        setEditFormOpen(true);
    }

    //删除
    const del = (id: number) => {
        //弹出对话框 是否删除？
        showDeleteConfirm(id);
    }

    const { confirm } = Modal;

    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该病种吗？',
            icon: <ExclamationCircleFilled />,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                console.log('OK');
                //删除的事件 DELETE
                await fetch(`https://47.120.14.174:443/petHospital/diseases/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
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
    const columns: ColumnsType<DiseaseInfo> = [
        {
            title: '序号',
            dataIndex: 'index',
            render: (text, record, index) => `${(pageOption.pageNo - 1) * pageOption.pageSize + (index + 1)}`,
            align: 'center',
            width: '10%'
            // key: 'userId',
        },
        {
            title: '疾病名称',
            dataIndex: 'diseaseName',
            align: 'center',
            ...getColumnSearchProps('diseaseName')
        },
        {
            title: '疾病类别',
            dataIndex: 'typeName',
            align: 'center',
            // 该列添加筛选功能
            filters: diseaseCategory,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (text: string, record) => record.typeName.startsWith(text),
        },
        {
            title: '操作',
            align: 'center',
            // key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditTwoTone onClick={() => {
                        //这一行的数据赋值给editRecord
                        setEditRecord(record)
                        edit(record)
                    }
                    } />
                    <DeleteTwoTone onClick={() => {
                        del(record.diseaseId)
                    }
                    } />
                </Space>
            ),
        },
    ];



    return (
        diseaseData ? (
            <div>
                <div style={{ textAlign: 'right', margin: 16 }}>
                    <Button type="primary" ghost onClick={addDisease}>新增病种</Button>
                </div>
                <DiseaseCreateForm
                    open={createOpenForm}
                    onCreate={onCreate}
                    onCancel={() => {
                        setCreateFormOpen(false);
                    }}
                />
                <DiseaseEditForm
                    open={editFormOpen}
                    record={editRecord}
                    onCreate={onCreate}
                    onCancel={() => {
                        setEditFormOpen(false);
                    }} />
                <Table columns={columns} dataSource={diseaseData} style={{ margin: 16 }} pagination={paginationProps}
                    loading={diseaseData.length === 0} />
            </div>) : (
            <>
                <Loading />
            </>)


    )
}

export default DiseaseManage;

