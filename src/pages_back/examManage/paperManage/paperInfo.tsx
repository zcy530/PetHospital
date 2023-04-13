import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined, DeleteTwoTone, EditTwoTone, ExclamationCircleFilled } from '@ant-design/icons';
import { InputRef, Modal } from 'antd';
import { Button, Input, Space, Table, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { ColumnsType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';


interface PaperType {
    paperId: number,
    paperName: string,
    score: number
}

type DataIndex = keyof PaperType;

const Paper: React.FC = () => {
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
        showDeleteConfirm(id);
    }

    const { confirm } = Modal;

    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该试卷吗？',
            icon: <ExclamationCircleFilled />,
            // content: '用户id为:' + id,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                console.log('OK');
                //删除的事件 DELETE
                await fetch(`http://localhost:8080/petHospital/papers/${id}`, {
                    method: 'DELETE',
                }).then((response) => {
                    if (response.status === 200) {
                        //DONE：重新加载数据 filter一下
                        setPaperData(
                            paperData.filter((data) => {
                                return data.paperId !== id
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
                <Link to={`/systemManage/paper/detail/${record.paperId}`}>
                    {text}
                </Link>
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
            {contextHolder}
            <Table style={{ margin: 16 }} columns={columns} dataSource={paperData} pagination={{ position: ['bottomCenter'] }} />;
        </div>
    )
}

export default Paper;