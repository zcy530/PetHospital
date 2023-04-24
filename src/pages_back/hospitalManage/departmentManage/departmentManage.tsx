//科室管理的界面

import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, InputRef, Modal, Space, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { SearchOutlined, EditTwoTone, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';
import { DepartmentType } from "./departmentType.tsx";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const DepartmentInfo: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

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
    const [departmentData, setMedicineData] = useState<DepartmentType[]>([]);
    //用于更新表格数据
    const [count, setCount] = useState(0);
    useEffect(() => {
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/departments', {
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        })
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                //console.log(data.result);
                setMedicineData(data.result);
                //设置posts值为data
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, [count]);


    //表格列搜索功能
    //列的下标
    type DataIndex = keyof DepartmentType;

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
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DepartmentType> => ({
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



    const [editFormOpen, setEditFormOpen] = useState(false);
    const [editRecord, setEditRecord] = useState<DepartmentType>();


    interface CollectionCreateFormProps {
        open: boolean;
        onCreate: () => void;
        onCancel: () => void;
    }
    //编辑操作
    const edit = (id: number) => {
        //console.log("点击编辑id为" + id);
        //跳出编辑的对话框
        setEditFormOpen(true); //设置open为true，用于弹出弹出修改用户信息的表单
    };


    const onCreate = () => {
        setEditFormOpen(false);
    };

    const DepartmentEditForm: React.FC<CollectionCreateFormProps> = ({
        open,
        onCreate,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        //set field value
        form.setFieldsValue(editRecord);
        form.setFieldValue("peopleList", editRecord?.peopleList.split(";").map(item => {
            return item
        })
        )
        //console.log(editRecord)
        return (
            //用Modal弹出表单
            <Modal
                open={open} //是
                title="修改科室信息"
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
                            var rstList = values.peopleList[0];
                            values.peopleList.forEach((element, idx) => {
                                if (idx !== 0) {
                                    rstList = rstList.concat(";").concat(element);
                                }
                            });
                            //console.log(rstList)
                            values.peopleList = rstList
                            //console.log(JSON.stringify(values))
                            fetch(`https://47.120.14.174:443/petHospital/departments/${editRecord?.departmentId}`, {
                                method: 'PUT',
                                body: JSON.stringify(values),
                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8',
                                    "Authorization": userInfo.data.result.token,
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
                    <Form.Item name="departmentId" hidden={true} />
                    <Form.Item
                        name="departmentName"
                        label="科室名称"
                        rules={[{ required: true, message: '请输入科室名称！' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="intro" label="科室简介"
                    // rules={[{ required: true, message: '请输入科室简介！' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="peopleList" label="科室人员" rules={[{ required: true, message: '请输入科室简介！' }]}>
                        <Form.List name="peopleList"
                            rules={[
                                {
                                    validator: async (_, peopleList) => {
                                        if (!peopleList || peopleList.length < 1) {
                                            return Promise.reject(new Error('至少输入一个人员'));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Form.Item
                                            // label={index === 0 ? '科室人员' : ''}
                                            required={false}
                                            key={field.key}
                                        >
                                            <Form.Item
                                                {...field}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: "请输入科室人员或者删除该条信息",
                                                    },
                                                ]}
                                                noStyle
                                            >
                                                <Input placeholder="people" style={{ width: '60%' }} />
                                            </Form.Item>
                                            {fields.length > 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => remove(field.name)}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            style={{ width: '60%' }}
                                            icon={<PlusOutlined />}
                                        >
                                            添加科室人员
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                    </Form.Item>

                </Form>
            </Modal>
        )
    };



    // 定义列
    const columns: ColumnsType<DepartmentType> = [
        {
            title: '序号',
            width: '10%',
            render: (text, record, index) => `${(pageOption.pageNo - 1) * pageOption.pageSize + (index + 1)}`,
            align: 'center',
        },
        {
            title: '名称',
            dataIndex: 'departmentName',
            align: 'center',
            // width: '50%',
            // 该列添加搜索功能
            ...getColumnSearchProps('departmentName'),
        },
        {
            title: '简介',
            dataIndex: 'intro',
            align: 'center',
            width: '30%',
        },
        {
            title: '负责人',
            dataIndex: 'peopleList',
            align: 'center',
            // width: '50%',
            // 该列添加搜索功能
            ...getColumnSearchProps('peopleList'),
            render: (text, record) => (
                text.split(";").map(s => (<Tag color='green'>
                    {s}
                </Tag>))
            ),
        },

        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    {/* <Link to={`/systemManage/process/detail/${record.processId}`}>
                        <EditTwoTone />
                    </Link> */}
                    <EditTwoTone onClick={() => {
                        edit(record.departmentId);
                        setEditRecord(record);
                    }} />

                </Space>
            ),
        },
    ];




    return (
        <div>
            {/* 编辑药品的表单 open为true时弹出 */}
            <DepartmentEditForm
                open={editFormOpen}
                onCreate={onCreate}
                onCancel={() => {
                    setEditFormOpen(false);
                }} />
            <Table columns={columns} dataSource={departmentData} pagination={paginationProps} style={{ margin: 16 }} />
        </div >
    );
}

export default DepartmentInfo;