//测试管理的页面
import React, { useRef, useState } from 'react';
import { SearchOutlined, DeleteTwoTone, EditTwoTone, } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table, message } from 'antd';
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Link } from 'react-router-dom';

interface DataType {
    testId: number;
    beginDate: string;
    endDate: string;
    testName: string;
    paperId: number
}

type DataIndex = keyof DataType;

const data: DataType[] = [
    {
        testId: 1,
        beginDate: "2023-04-06 21:06:04",
        endDate: "2023-04-06 22:30:00",
        testName: "肠胃病考试",
        paperId: 1
    },
    {
        testId: 1,
        beginDate: "2023-04-07 21:06:04",
        endDate: "2023-04-07 22:30:00",
        testName: "肠胃病考试",
        paperId: 1
    },
    {
        testId: 1,
        beginDate: "2023-04-05 21:06:04",
        endDate: "2023-04-05 22:30:00",
        testName: "肠胃病考试",
        paperId: 1
    }
];

const Test: React.FC = () => {
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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
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

    const columns: ColumnsType<DataType> = [
        {
            title: '测试名称',
            dataIndex: 'testName',
            key: 'testName',
            ...getColumnSearchProps('testName'),
            // TODO 点击查看试卷详情
            render: (text, record) => (
                <a href='/systemMenu/paper/id='>{text}</a> //点击跳转到试卷详情页
            ),
        },
        {
            title: '开始时间',
            dataIndex: 'beginDate',
            key: 'beginDate',
            // sort 
            sorter: (a, b) => (a.beginDate > b.beginDate) ? 1 : -1,
        },
        {
            title: '结束时间',
            dataIndex: 'endDate',
            key: 'endDate',
            // sort
            sorter: (a, b) => (a.endDate > b.endDate) ? 1 : -1,
        },
        {
            title: '操作',
            // key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditTwoTone onClick={() => {
                        console.log(record)
                        //这一行的数据赋值给editRecord
                        // setEditRecord(record)
                        // console.log(editRecord.email)
                        // edit(record)
                    }
                    } />
                    <DeleteTwoTone onClick={() => {
                        // del(record.userId)
                        //添加filter方法
                    }
                    } />
                </Space>
            ),
        },

    ];

    return (
        <div>
            {/* 新增考试 button */}
            <Link to="/systemManage/paper/insert">
                <Button type="primary">新增考试</Button>
            </Link>
            <Table style={{ margin: 16 }} columns={columns} dataSource={data} />;
        </div>
    )
};

export default Test;