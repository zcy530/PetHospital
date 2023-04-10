import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined, DeleteTwoTone, EditTwoTone, } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { ColumnsType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';


interface PaperType {
    paperId: number,
    paperName: string,
    score: number
}

type DataIndex = keyof PaperType;

const Paper: React.FC = () => {

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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<PaperType> => ({
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
            ) : (text),
    });



    //删除试卷
    const del = (id: number) => {

    }

    //获取全部试卷
    const [paperData, setPaperData] = useState<PaperType[]>([]);

    useEffect(() => {
        //获取后台数据
        fetch('http://localhost:8080/petHospital/papers'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                let records = data.result;
                let paperDataTmp: PaperType[] = [];
                //设置posts值为data
                records.map((record, index) => (
                    paperDataTmp.push({
                        paperId: record.paperId,
                        paperName: record.paperName,
                        score: record.score
                    })
                ));
                setPaperData(paperDataTmp);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    const columns: ColumnsType<PaperType> = [
        {
            title: '试卷名称',
            dataIndex: 'paperName',
            key: 'paperName',
            align: 'center',    // 设置文本居中的属性
            ...getColumnSearchProps('paperName'),
            // TODO 点击查看试卷详情
            render: (text, record) => (
                <a href='/systemMenu/paper/id='>{text}</a> //点击跳转到试卷详情页
            ),
        },
        {
            title: '试卷总分',
            dataIndex: 'score',
            key: 'score',
            align: 'center',    // 设置文本居中的属性
            // sort 
            sorter: (a, b) => a.score - b.score
        },
        {
            title: '操作',
            align: 'center',    // 设置文本居中的属性
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
                        del(record.paperId)
                        //添加filter方法
                    }
                    } />
                </Space>
            ),
        },

    ];

    return (
        <div>
            <Table style={{ margin: 16 }} columns={columns} dataSource={paperData} pagination={{ position: ['bottomCenter'] }} />;
        </div>
    )
}

export default Paper;