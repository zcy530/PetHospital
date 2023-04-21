//考题管理的页面
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, DeleteTwoTone, EditTwoTone, EyeOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { InputRef, Modal, Tag } from 'antd';
import { Button, Input, Space, Table, message } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { diseaseType } from '../../diseaseManage/diseaseType.tsx'
import { Link, useLocation } from 'react-router-dom';
import { QuestionType } from '../../examManage/questionManage/questionType.tsx'
import Loading from '../../global/loading.tsx'


type DataIndex = keyof QuestionType;

const QuestionInfo: React.FC = () => {

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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<QuestionType> => ({
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

    //删除考题
    const del = (id: number) => {
        //弹出对话框 是否删除？
        showDeleteConfirm(id);
    }

    const { confirm } = Modal;
    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该试题吗？',
            icon: <ExclamationCircleFilled />,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                console.log('OK');
                //删除的事件 DELETE
                await fetch(`https://47.120.14.174:443/petHospital/questions/${id}`, {
                    method: 'DELETE',
                }).then(
                    (response) => response.json()
                ).then((data) => {
                    console.log(data)
                    if (data.status === 200) {
                        console.log('删除成功！')
                        //返回删除成功的提示
                        message.success("删除成功！")
                        setQuestionData(
                            questionData.filter((data) => {
                                return data.questionId !== id
                            })
                        )
                    } else {
                        console.log('删除失败！')
                        message.error(data.message)
                    }
                }
                ).catch(e => {
                    console.log('错误:', e)
                    message.error("删除失败，请稍后再试！")
                });
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    //表格前面的选择框
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    //选中的问题
    const [questionList, setQuestionList] = useState<number[]>([]);
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

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        let questionIdList: number[] = [];
        newSelectedRowKeys.map((key) => {
            console.log("对应的问题的id：" + questionData[key].questionId)
            let id = questionData[key].questionId;
            questionIdList.push(id); //加入问题id的列表
        })
        console.log('selectedQuestion changed: ', questionIdList);
        setQuestionList(questionIdList)
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;


    //定义列
    const columns: ColumnsType<QuestionType> = [
        {
            title: '序号',
            dataIndex: 'key',
            align: 'center',
            render: (text, record, index) => `${text + 1}`,
            width: '10%'
        },
        {
            title: '题目描述',
            dataIndex: 'description',
            key: 'description',
            align: 'center',    // 设置文本居中的属性
            width: '40%',
            ...getColumnSearchProps('description'),
        },

        {
            title: '题目类型',
            dataIndex: 'questionType',
            align: 'center',    // 设置文本居中的属性
            filters: [{
                text: "单选",
                value: "单选"
            },
            {
                text: "多选",
                value: "多选"
            },
            {
                text: "判断",
                value: "判断"
            }],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string, record) => record.questionType.startsWith(value),
        },
        {
            title: '疾病',
            dataIndex: 'diseaseName',
            key: 'diseaseName',
            align: 'center',    // 设置文本居中的属性
            // width: '30%',
            // ...getColumnSearchProps('diseaseId'),
            filters: diseaseType,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string, record) => record.diseaseName.startsWith(value),
        },
        {
            title: '关键词',
            key: 'keyword',
            dataIndex: 'keyword',
            align: 'center',
            ...getColumnSearchProps('keyword'),
            render: (text, { keyword }) => (
                <>
                    <Tag color="geekblue" key={keyword}>
                        {text}
                    </Tag>
                </>
            ),
        },
        {
            title: '操作',
            align: 'center',
            // key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/systemManage/exercise/detail/${record.questionId}`}>
                        <EyeOutlined />
                    </Link>
                    <Link to={`/systemManage/exercise/update/${record.questionId}`}>
                        <EditTwoTone />
                    </Link>
                    <DeleteTwoTone onClick={() => {
                        del(record.questionId)
                        //添加filter方法
                    }
                    } />
                </Space>
            ),
        },

    ];

    //获取全部考题数据
    const [questionData, setQuestionData] = useState<QuestionType[]>([]);

    useEffect(() => {
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/questions'
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                console.log(data.result);
                let records = data.result;
                let questionDataTmp: QuestionType[] = [];
                //设置posts值为data
                records.map((record, index) => (
                    questionDataTmp.push({
                        key: index,
                        questionId: record.questionId,
                        description: record.description,
                        questionType: record.questionType,
                        keyword: record.keyword,
                        diseaseName: record.diseaseName
                    }
                    )
                ));
                setQuestionData(questionDataTmp);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);

    const hintError = () => {
        message.warning("请选择试题！")

    }

    const { state } = useLocation();

    return (
        questionData ? (
            <div style={{ margin: 16 }}>
                <Space wrap size={600}>
                    <Space>
                        <Button type="primary" onClick={reload} disabled={!hasSelected} loading={loading}>
                            Reload
                        </Button>
                        <span style={{ marginLeft: 8 }}>
                            {hasSelected ? `选择了 ${selectedRowKeys.length} 个考题` : ''}
                        </span>
                    </Space>

                    <Space>
                        <Link to="/systemManage/exercise/insert">
                            <Button type="primary" ghost>新增考题</Button>
                        </Link>

                        {/* 点击事件后的执行 */}
                        {selectedRowKeys.length !== 0 ? (
                            <Link to='/systemManage/exercise/generate'
                                state={{ questionList: questionList }}
                            >
                                <Button type="primary">
                                    生成试卷
                                </Button>
                            </Link>
                        ) : (
                            <Button type="primary" onClick={hintError}>
                                生成试卷
                            </Button>
                        )}
                    </Space>
                </Space>

                <Table style={{ margin: 16 }} rowSelection={rowSelection} columns={columns} dataSource={questionData} />;
            </div >
        ) : (
            <>
                <Loading />
            </>
        )
    )
};

export default QuestionInfo;