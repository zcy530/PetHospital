//考题管理的页面
import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, DeleteTwoTone, EditTwoTone, MinusCircleOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Form, InputRef, List, Modal, Select, Tag } from 'antd';
import { Button, Input, Space, Table, message, Checkbox, Radio, RadioChangeEvent, } from 'antd';
import type { ColumnsType, ColumnType, TableProps } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { diseaseType } from '../../diseaseManage/diseaseType.tsx'
import { Link } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';
import { QuestionType, QuestionDetailType } from '../../examManage/questionManage/questionType.tsx'

interface CollectionShowFormProps {
    open: boolean;
    record: QuestionType;
    onCreate: (values: QuestionDetailType) => void;
    onCancel: () => void;
}

type DataIndex = keyof QuestionType;

const { Option } = Select;


const QuestionInfo: React.FC = () => {
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

    //用于存储某一行的数据
    const [editRecord, setEditRecord] = useState<QuestionType>([]); //初始化为空

    //用于控制表单的开关
    const [formOpen, setFormOpen] = useState(false);

    const onCreate = (values: any) => {
        console.log('Received values of form: ', values);
        setFormOpen(false);
        setEditOpen(false);
    };




    //展示考题的详情
    const ShowQuestionForm: React.FC<CollectionShowFormProps> = ({
        open,
        record,
        onCreate,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        const [detail, setDetail] = useState<QuestionDetailType>({
            questionId: 0,
            questionType: '',
            description: '',
            choice: [],
            ans: [],
            keyword: '',
            diseaseName: ''
        });

        if (open === true) {
            console.log("record为" + record)
            fetch("http://localhost:8080/petHospital/questions/" + record.questionId, { method: 'GET' })
                .then(
                    (response) => response.json(),
                )
                .then((data) => {
                    console.log(data.result);
                    //设置detail值为data
                    setDetail(data.result);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }

        return (
            // 展示一个Form表单。
            <Modal
                open={open}
                title="题目详情"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                            console.log(detail)
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
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
                        <TextArea style={{ color: 'dimgrey' }} readOnly={true} rows={3} defaultValue={record.description} />
                    </Form.Item>
                    <Form.Item
                        name="diseaseName"
                        label="疾病名:"
                    >
                        <Input style={{ color: 'maroon' }} readOnly={true} defaultValue={record.diseaseName} />
                    </Form.Item>
                    <Form.Item
                        name="questionType"
                        label="题目类型:"
                    >
                        <Input style={{ color: 'mediumpurple' }} readOnly={true} defaultValue={record.questionType} />
                    </Form.Item>
                    <Form.Item
                        name="keyword"
                        label="关键词:"
                    >
                        <Tag color="geekblue" >{record.keyword}</Tag>
                        {/* <Input style={{ color: 'mediumpurple' }} readOnly={true} defaultValue={record.keyword} /> */}
                    </Form.Item>
                    <Form.Item
                        name="choice"
                        label="选项:"
                    >
                        <List
                            size="small"
                            bordered
                            dataSource={detail.choice}
                            renderItem={(item) => <List.Item style={{ color: 'steelblue' }}>{item}</List.Item>}
                        />
                    </Form.Item>
                    <Form.Item
                        name="ans"
                        label="答案:"
                    >
                        {/* <Input style={{ color: 'darkseagreen ' }} readOnly={true} value={detail.ans} /> */}
                        <List
                            size="small"
                            bordered
                            dataSource={detail.ans}
                            renderItem={(item) => <List.Item style={{ color: 'darkseagreen' }}>{item}</List.Item>}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        );
    };

    const edit = (record: QuestionType) => {
        setEditOpen(true)
    }

    const [editOpen, setEditOpen] = useState(false);

    //编辑考题的详情
    const EditQuestionForm: React.FC<CollectionShowFormProps> = ({
        open,
        record,
        onCreate,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        const [detail, setDetail] = useState<QuestionDetailType>({
            questionId: 0,
            questionType: '',
            description: '',
            choice: [],
            ans: [],
            keyword: '',
            diseaseName: ''
        });

        const [type, setType] = useState<'单选' | '多选' | '判断'>('单选');
        const [single, setSingle] = useState(false);
        const [multiple, setMultiple] = useState(true);
        const [judge, setJudge] = useState(true);

        const typeChange = (e: RadioChangeEvent) => {
            console.log(e.target.value)
            const type = e.target.value;
            setType(type);
            if (type === "多选") {
                setMultiple(false); //显示多选题答案
                setSingle(true);
                setJudge(true);
            }
            else if (type === "判断") {
                setJudge(false);
                setSingle(true);
                setMultiple(true);
            } else {
                setSingle(false);
                setMultiple(true);
                setJudge(true);
            }

        };

        if (open === true) {
            console.log("record为" + record)
            fetch("http://localhost:8080/petHospital/questions/" + record.questionId, { method: 'GET' })
                .then(
                    (response) => response.json(),
                )
                .then((data) => {
                    console.log(data.result);
                    //设置detail值为data
                    setDetail(data.result);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }

        return (
            // 展示一个Form表单。
            <Modal
                open={open}
                title="编辑题目"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            onCreate(values);
                            //todo: modify a question
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form>
                <Form.Item label="选择题型" name="questionType"
                    rules={[{ required: true, message: 'Question type is required' }]}>
                    <Radio.Group name="questionType" value={type} onChange={typeChange}>
                        <Radio.Button value="单选">单选</Radio.Button>
                        <Radio.Button value="多选">多选</Radio.Button>
                        <Radio.Button value="判断">判断</Radio.Button>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="选择疾病类别" name="diseaseId"
                    rules={[{ required: true, message: 'Disease  type is required' }]}>
                    <Select placeholder="Select a disease type" defaultValue={detail.deseaseName}>
                        {
                            diseaseType.map(disease => (
                                <Option value={disease.id}>{disease.text}</Option>
                            ))
                        }
                    </Select>
                </Form.Item>

                <Form.Item label="题目描述" name="description"
                    rules={[{ required: true, message: 'Required' }]}>
                    <TextArea rows={3} defaultValue={record.description} onChange={(e) => { console.log(e.target) }} />
                </Form.Item>

                <Form.Item label="关键词" name="keyword"
                >
                    <Input defaultValue={record.keyword} />
                </Form.Item>

                <Form.Item label="题目选项">
                
                    <Form.List name="choices">
                        {(fields, { add, remove }) => (
                            <>
                                {/* 怎么设置默认选项 */}
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'choice']}
                                            rules={[{ required: true, message: '请填写选项内容' }]}
                                        >
                                            <Input placeholder="选项" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item>
                                    <Button disabled={!judge} type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        添加选项
                                        {/* TODO: 限制加4个选项 */}
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Form.Item label="单选题答案" name="single_ans">
                    <Radio.Group disabled={single}>
                        <Radio value="0">A</Radio>
                        <Radio value="1">B</Radio>
                        <Radio value="2">C</Radio>
                        <Radio value="3">D</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item label="多选题答案" name="multi_ans">
                    <Checkbox.Group disabled={multiple}>
                        <Checkbox value="0">A</Checkbox>
                        <Checkbox value="1">B</Checkbox>
                        <Checkbox value="2">C</Checkbox>
                        <Checkbox value="3">D</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                <Form.Item label="判断题答案" name="judge_ans">
                    <Radio.Group disabled={judge}>
                        <Radio value="0"> 对 </Radio>
                        <Radio value="1"> 错 </Radio>
                    </Radio.Group>
                </Form.Item>

                </Form>
                
            </Modal>
        );
    };



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
            // content: '用户id为:' + id,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                console.log('OK');
                //删除的事件 DELETE
                await fetch(`http://localhost:8080/petHospital/questions/${id}`, {
                    method: 'DELETE',
                }).then((response) => {
                    if (response.status === 200) {
                        setQuestionData(
                            questionData.filter((data) => {
                                return data.questionId !== id
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

    //表格前面的选择框
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const generatePaper = () => {
        let questionIdList: number[] = [];
        console.log("选择了" + selectedRowKeys); //打印出key的列表
        //根据selectedRowKeys获取题目id
        selectedRowKeys.map((key) => {
            console.log("对应的问题的id：" + questionData[key].questionId)
            let id = questionData[key].questionId;
            questionIdList.push(id); //加入问题id的列表
        })
        console.log(questionIdList);
    }

    //定义列
    const columns: ColumnsType<QuestionType> = [
        {
            title: '题目描述',
            dataIndex: 'description',
            key: 'description',
            align: 'center',    // 设置文本居中的属性
            // width: '100px',
            ...getColumnSearchProps('description'),
            // todo: 点击进入题目详情
            // 展开题目详情 createForm
            render: (text, record) => (
                <a onClick={() => {
                    setEditRecord(record);
                    setFormOpen(true);
                }}>
                    {text}
                </a>
            )
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
                    <EditTwoTone onClick={() => {
                        console.log(record)
                        //这一行的数据赋值给editRecord
                        setEditRecord(record)
                        edit(record)
                    }
                    } />
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
        fetch('http://localhost:8080/petHospital/questions'
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

    return (
        <div>
            {contextHolder}
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
                    <Link to="/systemManage/exercise/generate">
                        <Button type="primary" onClick={generatePaper}>生成试卷</Button>
                    </Link>
                </Space>
            </Space>
            <ShowQuestionForm
                open={formOpen}
                record={editRecord}
                onCreate={onCreate}
                onCancel={() => {
                    setFormOpen(false);
                }} />

            <EditQuestionForm
                open={editOpen}
                record={editRecord}
                onCreate={onCreate}
                onCancel={() => {
                    setEditOpen(false);
                }} />
            <Table style={{ margin: 16 }} rowSelection={rowSelection} columns={columns} dataSource={questionData} pagination={{ position: ['bottomCenter'] }} />;
        </div >
    )
};

export default QuestionInfo;