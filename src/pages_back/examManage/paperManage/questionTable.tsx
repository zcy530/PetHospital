//考题管理的页面
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, DeleteTwoTone, EditTwoTone, EyeOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { InputRef, Modal, Tag } from 'antd';
import { Button, Input, Space, Table, message } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { diseaseOption, getDiseaseList } from '../../diseaseManage/diseaseType.tsx'
import { Question } from '../questionManage/questionType.tsx';
import { QuestionType } from '../../examManage/questionManage/questionType.tsx'
import Loading from '../../global/loading.tsx'
import { useSelector } from 'react-redux';


type DataIndex = keyof QuestionType;

const QuestionTable: React.FC = (props) => {
    const userLogin = useSelector(state => state.userLogin)
    const token = userLogin.userInfo.data.result.token;
    const [diseaseType, setDiseaseType] = useState<diseaseOption[]>([]);
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

    //选中的问题
    const [addList, setAddList] = useState<Question[]>([])


    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
        let selectedQuestions: number[] = [];
        newSelectedRowKeys.map((key) => {
            const id = questionData[key].questionId;
            selectedQuestions.push(id)
        })
        // console.log(selectedQuestions)
        setQuestionList(selectedQuestions)
    };

    //点击确认后
    const confirmAdd = () => {
        let selectedList: Question[] = [];
        questionList.map(async id => {
            await fetch("https://47.120.14.174:443/petHospital/questions/" + id, {
                method: 'GET',
                headers: { 'Authorization': token }
            })
                .then(
                    (response) => response.json(),
                )
                .then((data) => {
                    // console.log(data.result);
                    const res = data.result;
                    //字符串数组拼接为字符串。。。
                    let str = ''
                    for (let i = 0; i < res.choice.length - 1; i++) {
                        str += res.choice[i]
                        str += ';'
                    }
                    str += res.choice[res.choice.length - 1]
                    // let list = addList;
                    selectedList.push({
                        "questionId": res.questionId,
                        "choice": str,
                        "description": res.description,
                        "questionType": res.questionType,
                        "score": null
                    })
                    //设置questionList的值
                    // setAddList(list)
                })
                .catch((err) => {
                    console.log(err.message);
                });
        })
        console.log(selectedList)
        setTimeout(() => {
            //传给父组件
            props.getSelectedQuestions(selectedList); //传添加的问题列表
            props.setOpen(false); //点击确认后窗口关闭
        }, 1000)
    }

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
        }

    ];

    //获取全部考题数据
    const [questionData, setQuestionData] = useState<QuestionType[]>([]);

    useEffect(() => {
        const diseaseList = getDiseaseList(token);
        setDiseaseType(diseaseList)
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/questions',
            { headers: { 'Authorization': token } }
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

    return (
        questionData ? (
            <div >
                <Table style={{ margin: 16 }} rowSelection={rowSelection} columns={columns} dataSource={questionData}
                    pagination={{ defaultPageSize: 5 }} />
                {/* 设置每页显示五个题目 */}
                <div style={{ textAlign: 'right', margin: 16 }}>
                    {selectedRowKeys.length !== 0 ? (
                        <>
                            <Button type="primary" onClick={() => { confirmAdd() }}>确认添加</Button>
                        </>
                    ) : (
                        <>
                            <Button type="primary" onClick={hintError}>确认添加</Button>

                        </>
                    )}
                </div>
            </div >
        ) : (
            <>
                <Loading />
            </>
        )
    )
};

export default QuestionTable;