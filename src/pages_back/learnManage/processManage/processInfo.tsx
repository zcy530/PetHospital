import { Button, Input, InputRef, Modal, Space, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteTwoTone, SearchOutlined, EditTwoTone, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import { ProcessType } from "./processType.js";
import Highlighter from 'react-highlight-words';


const ProcessInfo: React.FC = () => {

    /**
     * 定义表格数据
     */

    //定义表格数据使用
    const [processData, setProcessData] = useState<ProcessType[]>([]);
    useEffect(() => {
        //获取后台数据
        fetch('http://localhost:8080/petHospital/processes'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                setProcessData(data.result);
                //设置posts值为data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    /**
     * 多选部分
     */

    //用于多选的变量和函数
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);

    //重置选择状态
    const reload = () => {
        setLoading(true);
        // ajax request after empty completing
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 1000);
    };

    //监听选择框编号
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    //定义每行前面的选择框
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    //被选的行数
    const hasSelected = selectedRowKeys.length > 0;

    //批量删除
    const batchDel = () => {

    }


    /**
    * 定义表格列和表格搜索
    */


    //表格列搜索功能
    //列的下标
    type DataIndex = keyof ProcessType;

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
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ProcessType> => ({
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


    // 定义列
    const columns: ColumnsType<ProcessType> = [
        {
            title: '流程id',
            dataIndex: 'processId',
            key: 'processId',
            align: 'center',
        },
        {
            title: '流程名称',
            dataIndex: 'processName',
            key: 'processName',
            align: 'center',
            // width: '50%',
            // 该列添加搜索功能
            ...getColumnSearchProps('processName'),
        },
        {
            title: '流程简介',
            dataIndex: 'intro',
            key: 'intro',
            align: 'center',
            // width: '30%',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    {/* /systemManage/case/insert */}
                    <Link to={`/systemManage/process/detail/${record.processId}`}>
                        <EyeOutlined />
                    </Link>
                    <EditTwoTone />
                    <DeleteTwoTone onClick={() => {
                        del(record.processId)
                    }} />

                </Space>
            ),
        },
    ];


    /**
     * 删除操作
     */

    //删除操作
    const del = (id: number) => {
        console.log("点击删除id为" + id + "的流程");
        //弹出对话框 是否删除？
        showDeleteConfirm(id);
    }
    const { confirm } = Modal;
    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该流程吗？',
            icon: <ExclamationCircleFilled />,
            // content: '用户id为:' + id,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                console.log('OK');
                //删除的事件 DELETE
                const data: ProcessType[] = processData.filter((item: ProcessType) => item.processId !== id);
                setProcessData(data);
                fetch(`http://localhost:8080/petHospital/processes/${id}`, {
                    method: 'DELETE',
                }).then((response) => {
                    if (response.status === 200) {
                        console.log('删除成功！')
                        message.success("操作成功！");
                        //返回删除成功的提示
                    } else {
                        console.log('删除失败！')
                        fail()
                    }
                }).catch(e => {
                    console.log('错误:', e)
                    fail()
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };



    return (
        <div>
            <Space size={500}>
                <Space>
                    <Button type="primary" onClick={reload} disabled={!hasSelected} loading={loading}>
                        Reload
                    </Button>
                    <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `选择了 ${selectedRowKeys.length} 个流程` : ''}
                    </span>
                </Space>
                <Space wrap>
                    <Link to="/systemManage/process/insert">
                        <Button type="primary" ghost>新增流程</Button>
                    </Link>
                    <Button type="primary" danger ghost onClick={batchDel}>删除流程</Button>
                </Space>
            </Space>
            <Table rowSelection={rowSelection} columns={columns} dataSource={processData} style={{ margin: 16 }} rowKey="processId" />
        </div >
    );
};

export default ProcessInfo;