import { Button, Input, InputRef, Modal, Space, Table, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RoleType } from "./roleType.tsx";
import { ColumnsType } from "antd/es/table/InternalTable.js";
import { DeleteTwoTone, SearchOutlined, EditTwoTone, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface.js";
import Highlighter from 'react-highlight-words';


const RoleInfo = () => {
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
    const [roleData, setRoleData] = useState<RoleType[]>([]);
    useEffect(() => {
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/actors'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                ////console.log(data.result);
                setRoleData(data.result);
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
    type DataIndex = keyof RoleType;

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
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<RoleType> => ({
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
    const columns: ColumnsType<RoleType> = [
        {
            title: '序号',
            width: '5%',
            render: (text, record, index) => `${(pageOption.pageNo - 1) * pageOption.pageSize + (index + 1)}`,
            align: 'center',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: '10%',
            // 该列添加搜索功能
            ...getColumnSearchProps('name'),
        },
        {
            title: '工作内容',
            dataIndex: 'content',
            key: 'content',
            align: 'center',
            // width: '30%',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/systemManage/role/detail/${record.actorId}`}>
                        <EyeOutlined />
                    </Link>
                    <Link to={`/systemManage/role/update/${record.actorId}`}>
                        <EditTwoTone />
                    </Link>
                    <DeleteTwoTone onClick={() => {
                        del(record.actorId)
                    }} />

                </Space>
            ),
        },
    ];

    /**
     * 删除操作
     */

    // 删除操作
    const del = (id: number) => {
        //console.log("点击删除id为" + id + "的角色");
        //弹出对话框 是否删除？
        showDeleteConfirm(id);
    }
    const { confirm } = Modal;
    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该角色吗？',
            icon: <ExclamationCircleFilled />,
            // content: '用户id为:' + id,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                //console.log('OK');
                //删除的事件 DELETE
                const data: RoleType[] = roleData.filter((item: RoleType) => item.actorId !== id);
                setRoleData(data);
                fetch(`https://47.120.14.174:443/petHospital/actors/${id}`, {
                    method: 'DELETE',
                }).then((response) => {
                    if (response.status === 200) {
                        //console.log('删除成功！')
                        message.success("删除成功！");
                        //返回删除成功的提示
                    } else {
                        //console.log('删除失败！')
                        message.error("删除失败！");
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





    return (
        <div>
            <div style={{ textAlign: 'right', margin: 16 }}>
                <Space size={500}>
                    <Space wrap>
                        <Link to="/systemManage/role/insert">
                            <Button type="primary" ghost>新增角色</Button>
                        </Link>
                    </Space>
                </Space>
            </div>
            <Table columns={columns} dataSource={roleData} style={{ margin: 16 }} rowKey="actorId"
                pagination={paginationProps}
                expandable={{
                    columnTitle: "角色职责",
                    columnWidth: "5%",
                    defaultExpandAllRows: false,
                    expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.responsibility}</p>,
                    rowExpandable: (record) => record.responsibility !== null,
                }} />
        </div >
    );
}
export default RoleInfo;