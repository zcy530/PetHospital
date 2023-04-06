//考题管理的页面
import React, { useRef, useState } from 'react';
import { SearchOutlined, DeleteTwoTone, EditTwoTone, } from '@ant-design/icons';
import { Form, InputRef, List, Modal, Select,  Tag } from 'antd';
import { Button, Input, Space, Table, message } from 'antd';
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { diseaseType } from '../../diseaseManage/diseaseType.tsx'
import { Link } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';

interface DataType {
    questionId: number;
    choice: string[];
    ans: string,
    score: number;
    keyword: string;
    diseaseType: string;
    description: string;
    questionType: string;
}

interface CollectionShowFormProps {
    open: boolean;
    record: DataType;
    onCreate: (values: DataType) => void;
    onCancel: () => void;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
    {
        questionId: 1,
        choice: ["肠胃病", "胃穿孔"],
        ans: "胃穿孔",
        score: 5,
        diseaseType: "内科病",
        description: "aaa",
        questionType: "单选",
        keyword: "肠胃病"
    },
    {
        questionId: 2,
        choice: ["对", "错"],
        ans: "对",
        score: 5,
        diseaseType: "内科病",
        description: "aaa",
        questionType: "判断",
        keyword: "肠胃病"
    },
    {
        questionId: 3,
        choice: ["肠胃病", "胃穿孔"],
        ans: "胃穿孔",
        score: 5,
        diseaseType: "内科病",
        description: "aaa",
        questionType: "多选",
        keyword: "肠胃病"
    }
];

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


    //用于存储某一行的数据
    const [editRecord, setEditRecord] = useState<DataType>([]); //初始化为空

    //用于控制表单的开关
    const [formOpen, setFormOpen] = useState(false);

    const onCreate = (values: any) => {
        console.log('Received values of form: ', values);
        setFormOpen(false);
    };

    const ShowQuestionForm: React.FC<CollectionShowFormProps> = ({
        open,
        record,
        onCreate,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        return (
            // 展示一个Form表单。
            <Modal
                open={open}
                title="题目详情"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
            // onOk={() => {
            //     form
            //         .validateFields()
            //         .then((values) => {
            //             form.resetFields();
            //             onCreate(values);
            //             // console.log(values.diseaseName + ' ' + values.typeName)

            //         })
            //         .catch((info) => {
            //             console.log('Validate Failed:', info);
            //         });
            // }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                >
                    <Form.Item
                        name="description"
                        label="题目描述:"
                    >
                        <TextArea readOnly={true} rows={3} defaultValue={record.description} />

                    </Form.Item>
                    <Form.Item
                        name="typeName"
                        label="疾病类别:"
                    >
                        <Input readOnly={true} defaultValue={record.diseaseType} />
                    </Form.Item>
                    <Form.Item
                        name="questionType"
                        label="题目类型:"
                    >
                        <Input readOnly={true} defaultValue={record.questionType} />
                    </Form.Item>
                    <Form.Item
                        name="choice"
                        label="选项:"
                    >
                        <List
                            size="small"
                            bordered
                            dataSource={record.choice}
                            renderItem={(item) => <List.Item>{item}</List.Item>}
                        />
                    </Form.Item>
                    <Form.Item
                        name="ans"
                        label="答案:"
                    >
                        <Input readOnly={true} defaultValue={record.ans} />
                    </Form.Item>

                </Form>
            </Modal>
        );
    };


    const columns: ColumnsType<DataType> = [
        {
            title: '题目描述',
            dataIndex: 'description',
            key: 'description',
            // width: '30%',
            ...getColumnSearchProps('description'),
            // todo: 点击进入题目详情
            // 展开题目详情 createForm
            render: (text, record) => (
                <a onClick={() => {
                    setFormOpen(true);
                    setEditRecord(record);
                }}>
                    {text}
                </a>
            )
        },

        {
            title: '题目类型',
            dataIndex: 'questionType',
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
            title: '疾病类别',
            dataIndex: 'diseaseType',
            key: 'diseaseType',
            // width: '30%',
            // ...getColumnSearchProps('diseaseId'),
            filters: diseaseType,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string, record) => record.diseaseType.startsWith(value),
        },
        {
            title: '关键词',
            key: 'keyword',
            dataIndex: 'keyword',
            render: (text, { keyword }) => (
                <>
                    <Tag color = "geekblue" key = {keyword}>
                        {text}
                    </Tag>
                </>
            ),
            filters: diseaseType,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string, record) => record.keyword.startsWith(value),
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
            <Space wrap>
                <Link to="/systemManage/exercise/insert">
                    <Button type="primary" ghost>新增考题</Button>
                </Link>
                <Button type="primary" >生成试卷</Button>
            </Space>
            <ShowQuestionForm
                open={formOpen}
                record={editRecord}
                onCreate={onCreate}
                onCancel={() => {
                    setFormOpen(false);
                }} />
            <Table style={{ margin: 16 }} columns={columns} dataSource={data} />;
        </div>
    )
};

export default QuestionInfo;