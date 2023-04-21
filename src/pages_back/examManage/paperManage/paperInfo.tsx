import React, { useEffect, useRef, useState } from 'react'
import { SearchOutlined, DeleteTwoTone, EditTwoTone, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { InputRef, Modal } from 'antd';
import { Button, Input, Space, Table, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { ColumnsType } from 'antd/es/table';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { Link } from 'react-router-dom';
import { PaperType } from './paperType.tsxy'


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
                await fetch(`https://47.120.14.174:443/petHospital/papers/${id}`, {
                    method: 'DELETE',
                }).then(
                    (response) => response.json()
                ).then((data) => {
                    if (data.status === 200) {
                        console.log('删除成功！')
                        //返回删除成功的提示
                        message.success("删除成功！")
                        //filter一下
                        setPaperData(
                            paperData.filter((data) => {
                                return data.paperId !== id
                            })
                        )
                    } else { //status===409 有关联场次 无法删除
                        console.log('删除失败！')
                        message.error(data.message)
                    }
                }).catch(e => {
                    console.log('错误:', e)
                    message.error("删除失败！")
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
        fetch('https://47.120.14.174:443/petHospital/papers'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                setPaperData(data.result);
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
                    <Link to={`/systemManage/paper/detail/${record.paperId}`}>
                        <EyeOutlined />
                    </Link>
                    <Link to={`/systemManage/paper/update/${record.paperId}`}>
                        <EditTwoTone />
                    </Link>
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
            <Table style={{ margin: 16 }} columns={columns} dataSource={paperData} />
        </div>
    )
}

export default Paper;