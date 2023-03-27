import React, { useState, useRef } from 'react';
import {
    UploadOutlined,
} from '@ant-design/icons';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { DeleteTwoTone, SearchOutlined, EditTwoTone } from '@ant-design/icons';
import { Button, Input, InputRef, Space, Table } from 'antd'
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
//导入CaseData & CaseType
import { CaseData } from './caseData.tsx';
import { CaseType } from "./caseType";
import { Link, useNavigate } from "react-router-dom";
import { Container } from 'react-bootstrap';

//列的下标
type DataIndex = keyof CaseType;

const CaseInfo: React.FC = () => {
    const navigateTo = useNavigate(); //定义一个跳转遍历

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
    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<CaseType> => ({
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
    const columns: ColumnsType<CaseType> = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '疾病名',
            dataIndex: 'disease_name',
            key: 'disease_name',
            // width: '30%',
            // 该列添加搜索功能
            ...getColumnSearchProps('disease_name'),
            // render: (text) => <a>{text}</a>,
        },
        {
            title: '病例名',
            dataIndex: 'case_name',
            key: 'case_name',
            // width: '50%',
            ...getColumnSearchProps('case_name'),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditTwoTone />
                    <DeleteTwoTone />
                </Space>
            ),
        },
    ];



    //点击上传病例
    const upLoadCase = (e) => {
        console.log('跳转至上传病例页面');
        navigateTo('/systemManage/case/update');
    }

    return (
        <Container>
            <div style={{ margin: 16 }}>
                {/* <Link to="/systemManage/case/update"> */}
                    <Button type="primary"  href='/systemManage/case/insert'>上传病例<UploadOutlined /> </Button>
                {/* </Link> */}
            </div>
            {/* 病例的表格 */}
            <div className='case_box' style={{ margin: 16 }} >
                <Table className="case_table" columns={columns} dataSource={CaseData} />;
            </div>
        </Container>
    );
};

export default CaseInfo;