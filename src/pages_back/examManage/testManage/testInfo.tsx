//测试管理的页面
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, DeleteTwoTone, EyeOutlined, EditTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import { InputRef, Modal } from 'antd';
import { Button, Input, Space, Table, Tag, message } from 'antd';
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import type { FilterConfirmProps, } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';

interface TestType {
    testId: number;
    beginDate: string;
    endDate: string;
    testName: string;
    intro: string;
    tag: string;
    paperId: number
}

type DataIndex = keyof TestType;

const Test: React.FC = () => {
    //全局消息提示
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: '操作成功',
            duration: 1,
        });
    };

    const fail = () => {
        messageApi.open({
            type: 'error',
            content: '操作失败，请重试！',
            duration: 1
        });
    }
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<TestType> => ({
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


    //删除场次
    const del = (id: number) => {
        showDeleteConfirm(id);
    }

    const { confirm } = Modal;

    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该考试场次吗？',
            icon: <ExclamationCircleFilled />,
            // content: '用户id为:' + id,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                console.log('OK');
                //删除的事件 DELETE
                await fetch(`http://localhost:8080/petHospital/tests/${id}`, {
                    method: 'DELETE',
                }).then((response) => {
                    if (response.status === 200) {
                        //DONE：重新加载数据 filter一下
                        setTestData(
                            testData.filter((data) => {
                                return data.testId !== id
                            })
                        )
                        console.log('删除成功！')
                        //返回删除成功的提示
                        success()
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


    const columns: ColumnsType<TestType> = [
        {
            title: '测试名称',
            dataIndex: 'testName',
            key: 'testName',
            ...getColumnSearchProps('testName'),
            align: 'center',    // 设置文本居中的属性
            // TODO 点击查看试卷详情
            render: (text, record) => (
                <Link to={`/systemManage/paper/detail/${record.paperId}`}>
                    {text}
                </Link>
            ),
        },
        {
            title: '简介',
            dataIndex: 'intro',
            key: 'intro',
            align: 'center',    // 设置文本居中的属性
            width: '30%',
        },
        {
            title: '标签',
            dataIndex: 'tag',
            key: 'tag',
            align: 'center',    // 设置文本居中的属性
            render: (text, record) => (
                <Tag color="geekblue" >{text} </Tag>
            ),

        },
        {
            title: '开始时间',
            dataIndex: 'beginDate',
            key: 'beginDate',
            align: 'center',    // 设置文本居中的属性
            // sort 
            sorter: (a, b) => (a.beginDate > b.beginDate) ? 1 : -1,
        },
        {
            title: '结束时间',
            dataIndex: 'endDate',
            key: 'endDate',
            align: 'center',    // 设置文本居中的属性
            // sort
            sorter: (a, b) => (a.endDate > b.endDate) ? 1 : -1,
        },
        {
            title: '操作',
            align: 'center',    // 设置文本居中的属性
            // key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/systemManage/test/detail/${record.testId}`}>
                        <EyeOutlined />
                    </Link>
                    <Link to={`/systemManage/test/update/${record.testId}`}>
                        <EditTwoTone />
                    </Link>
                    <DeleteTwoTone onClick={() => {
                        del(record.testId)
                    }
                    } />
                </Space>
            ),
        },
    ];

    //获取全部考题数据
    const [testData, setTestData] = useState<TestType[]>([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        //获取后台数据
        fetch('http://localhost:8080/petHospital/tests'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                let records = data.result;
                let testDataTmp: TestType[] = [];
                //设置posts值为data
                records.map((record, index) => (
                    testDataTmp.push({
                        testId: record.testId,
                        testName: record.testName,
                        intro: record.intro,
                        tag: record.tag,
                        paperId: record.paperId,
                        beginDate: record.beginDate,
                        endDate: record.endDate
                    }
                    )
                ));
                setTestData(testDataTmp);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, [count]);

    return (
        <div>
            {contextHolder}
            {/* 新增考试 button */}
            <Link to="/systemManage/test/insert">
                <Button type="primary" ghost>新增考试场次</Button>
            </Link>
            <Table style={{ margin: 16 }} columns={columns} dataSource={testData} pagination={{ position: ['bottomCenter'] }} />;
        </div>
    )
};

export default Test;