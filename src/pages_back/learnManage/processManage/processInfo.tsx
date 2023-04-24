import { Button, Input, InputRef, Modal, Space, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteTwoTone, SearchOutlined, EditTwoTone, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import { ProcessType } from "./processType.js";
import Highlighter from 'react-highlight-words';
import { useSelector } from "react-redux";


const ProcessInfo: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

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

    /**
     * 定义表格数据
     */

    //定义表格数据使用
    const [processData, setProcessData] = useState<ProcessType[]>([]);
    useEffect(() => {
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/processes', {
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        }
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                ////console.log(data.result);
                setProcessData(data.result);
                //设置posts值为data
            })
            .catch((err) => {
                ////console.log(err.message);
            });
    }, []);


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
            title: '序号',
            width: '10%',
            render: (text, record, index) => `${(pageOption.pageNo - 1) * pageOption.pageSize + (index + 1)}`,
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
                    <Link to={`/systemManage/process/detail/${record.processId}`}>
                        <EyeOutlined />
                    </Link>
                    <Link to={`/systemManage/process/update/${record.processId}`}>
                        <EditTwoTone />
                    </Link>
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
        ////console.log("点击删除id为" + id + "的流程");
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
                ////console.log('OK');
                //删除的事件 DELETE
                const data: ProcessType[] = processData.filter((item: ProcessType) => item.processId !== id);
                setProcessData(data);
                fetch(`https://47.120.14.174:443/petHospital/processes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": userInfo.data.result.token,
                    }
                }).then((response) => {
                    if (response.status === 200) {
                        ////console.log('删除成功！')
                        message.success("删除成功！");
                        //返回删除成功的提示
                    } else {
                        ////console.log('删除失败！')
                        message.error("删除失败！");
                    }
                }).catch(e => {
                    ////console.log('错误:', e)
                    fail()
                });
            },
            onCancel() {
                ////console.log('Cancel');
            },
        });
    };



    return (
        <div>
            <div style={{ textAlign: 'right', margin: 16 }}>
                <Space wrap>
                    <Link to="/systemManage/process/insert">
                        <Button type="primary" ghost>新增流程</Button>
                    </Link>
                </Space>
            </div>
            <Table columns={columns} dataSource={processData} style={{ margin: 16 }} rowKey="processId" pagination={paginationProps} />
        </div >
    );
};

export default ProcessInfo;