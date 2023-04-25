import React, { useState, useRef, useEffect } from 'react';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { DeleteTwoTone, SearchOutlined, EditTwoTone, ExclamationCircleFilled, EyeOutlined } from '@ant-design/icons';
import { Button, Input, InputRef, Modal, Space, Table, message } from 'antd'
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
//导入CaseData & CaseType
import { CaseType } from "./caseType";
import { Link } from "react-router-dom";
import { getCategoryList, diseaseOption } from '../diseaseManage/diseaseType.tsx';
import { useSelector } from 'react-redux';

//列的下标
type DataIndex = keyof CaseType;

const CaseInfo: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

    //分页默认值，记得import useState
    const [pageOption, setPageOption] = useState({
        pageNo: 1,  //当前页为1
        pageSize: 10, //一页10行
    })

    //分页配置
    const paginationProps = {
        current: pageOption.pageNo,
        pageSize: pageOption.pageSize,
        onChange: (current, size) => paginationChange(current, size)
    }

    //当翻页时，改变当前为第current页，current和size这两参数是onChange API自带的，会帮你算出来你现在在第几页，这一页有多少行数据。
    const paginationChange = async (current, size) => {
        //前面用到useState
        setPageOption({
            pageNo: current, //当前所在页面
            pageSize: size,  //一页有几行
        })
    }


    //定义表格数据使用
    const [caseData, setCaseData] = useState<CaseType[]>([]);
    //疾病类型
    const [diseaseCategory, setDiseaseCategory] = useState<diseaseOption[]>([]);
    useEffect(() => {
        const diseaseList = getCategoryList(userInfo.data.result.token)
        console.log(diseaseList);
        setDiseaseCategory(diseaseList)
        //获取后台数据
        fetch('https://47.120.14.174:443/petHospital/cases', {
            headers: {
                "Authorization": userInfo.data.result.token,
            }
        }
        )
            .then(
                (response) => response.json(),
            )
            .then((data) => {
                //console.log(data.result);
                const posts = data.result;
                const data1: CaseType[] = [];
                for (let i = 0; i < posts.length; i++) {
                    data1.push({
                        key: i,
                        case_id: posts[i].illCaseId,
                        case_name: posts[i].illCaseName,
                        disease_name: posts[i].disease ? posts[i].disease.diseaseName : '--',
                        disease_type: posts[i].disease ? posts[i].disease.typeName : '--'
                    });
                }
                setCaseData(data1);
            })
            .catch((err) => {
                //console.log(err.message);
            });
    }, []);

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

    //重置搜索框
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



    //删除操作
    const del = (id: number) => {
        //console.log("点击删除id为" + id + "的病例");
        //弹出对话框 是否删除？
        showDeleteConfirm(id);
    }
    const { confirm } = Modal;
    const showDeleteConfirm = (id: number) => {
        confirm({
            title: '确认删除该病例吗？',
            icon: <ExclamationCircleFilled />,
            // content: '用户id为:' + id,
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            async onOk() {
                //console.log('OK');
                //删除的事件 DELETE
                const data: CaseType[] = caseData.filter((item: CaseType) => item.case_id !== id);
                setCaseData(data);
                fetch(`https://47.120.14.174:443/petHospital/cases/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": userInfo.data.result.token,
                    }
                }).then((response) => {
                    if (response.status === 200) {
                        //TODO：重新加载页面（好像并不合适）
                        //console.log('删除成功！')
                        message.success("删除成功！");
                        //返回删除成功的提示
                    } else {
                        //console.log('删除失败！')
                        message.error("删除失败，请稍后再试！");
                    }
                }).catch(e => {
                    //console.log('错误:', e)
                    fail()
                });
            },
            onCancel() {
                //console.log('Cancel');
            },
        });
    };

    // 定义列
    const columns: ColumnsType<CaseType> = [
        {
            title: '序号',
            width: '10%',
            render: (text, record, index) => `${(pageOption.pageNo - 1) * pageOption.pageSize + (index + 1)}`,
            align: 'center',
        },
        {
            title: '病例名称',
            dataIndex: 'case_name',
            key: 'case_name',
            align: 'center',
            // width: '50%',
            ...getColumnSearchProps('case_name'),
        },
        {
            title: '疾病名称',
            dataIndex: 'disease_name',
            key: 'disease_name',
            align: 'center',
            // width: '30%',
            // 该列添加搜索功能
            ...getColumnSearchProps('disease_name'),
            // render: (text) => <a>{text}</a>,
        },
        {
            title: '疾病类型',
            dataIndex: 'disease_type',
            key: 'disease_type',
            align: 'center',
            // width: '50%',
            filters: diseaseCategory,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value: string, record) => record.disease_type.startsWith(value),
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    {/* /systemManage/case/insert */}
                    <Link to={`/systemManage/case/detail/${record.case_id}`}>
                        <EyeOutlined />
                    </Link>
                    <Link to={`/systemManage/case/update/${record.case_id}`}>
                        <EditTwoTone />
                    </Link>
                    <DeleteTwoTone onClick={() => {
                        del(record.case_id)
                    }} />

                </Space>
            ),
        },
    ];

    return (

        <div>
            <div style={{ textAlign: 'right', margin: 16 }}>
                <Space wrap>
                    <Link to="/systemManage/case/insert">
                        <Button type="primary" ghost>新增病例</Button>
                    </Link>
                </Space>
            </div>
            <Table columns={columns} dataSource={caseData} pagination={paginationProps}
                style={{ margin: 16 }} rowKey="case_id" loading={caseData.length === 0} />
        </div >

    );
};

export default CaseInfo;