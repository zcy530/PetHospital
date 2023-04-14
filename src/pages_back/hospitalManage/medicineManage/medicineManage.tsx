//药品管理界面
import React, { useEffect, useRef, useState } from "react";
import { Button, Input, InputRef, Modal, Space, Table, Tag, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { DeleteTwoTone, SearchOutlined, EditTwoTone, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';
import { MedicineType } from "./medicineType.tsx";

const MedicineInfo: React.FC = () => {
    //定义表格数据使用
    const [medicineData, setMedicineData] = useState<MedicineType[]>([]);
    useEffect(() => {
        //获取后台数据
        fetch('http://localhost:8080/petHospital/drugs'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                setMedicineData(data.result);
                //设置posts值为data
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    //表格列搜索功能
    //列的下标
    type DataIndex = keyof MedicineType;

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
                console.log('OK');
                fetch(`http://localhost:8080/petHospital/drugs/${id}`, {
                    method: 'DELETE',
                }).then((response) => {
                    if (response.status === 200) {
                        console.log('删除成功！')
                        message.success("操作成功！");
                        //删除的事件 DELETE
                        setMedicineData(medicineData.filter((item) => { return item.id !== id }));
                        //返回删除成功的提示
                    } else {
                        console.log('删除失败！')
                        message.error("操作失败，请重试！");
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

    const addVaccine = () => {
        //弹出表单新增疫苗
    }

    // 定义列
    const columns: ColumnsType<MedicineType> = [
        {
            title: '序号',
            dataIndex: 'id',
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
                    {/* /systemManage/case/insert */}
                    <Link to={`/systemManage/process/detail/${record.processId}`}>
                        <EyeOutlined />
                    </Link>
                    <EditTwoTone />
                    <DeleteTwoTone onClick={() => {
                        del(record.id)
                    }} />

                </Space>
            ),
        },
    ];




    return (
        <div>
            <Space wrap>
                <Button type="primary" ghost onClick={addVaccine}>新增疫苗</Button>
            </Space>
            <Table columns={columns} dataSource={medicineData} style={{ margin: 16 }} />
        </div >
    );
}

export default MedicineInfo;