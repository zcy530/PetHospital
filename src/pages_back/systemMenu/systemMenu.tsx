import React, { useState, useRef } from 'react';
import {
  ContainerOutlined,
  PieChartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  HddOutlined,
  ContactsOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  ReconciliationOutlined,
  FolderOpenOutlined,
  IdcardOutlined,
  TeamOutlined,
  PartitionOutlined,
  UploadOutlined,

} from '@ant-design/icons';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { DeleteTwoTone, SearchOutlined, EditTwoTone } from '@ant-design/icons';
import { MenuProps, Button, Input, Space, Table, Upload } from 'antd'
import { Layout, InputRef, Menu, theme } from 'antd';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
//导入caseData & CaseType
import { caseData } from './caseManage/caseData.tsx';
import { CaseType } from "./caseManage/caseType";
//重定向路由
import { useRoutes, Outlet, useNavigate } from "react-router-dom";
import "./systemMenu.css";


const { Content, Sider } = Layout;

//列的下标
type DataIndex = keyof CaseType;

//菜单Item
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  // item: label key（写路径） icon children type
  getItem('病例管理', '/systemMenu', <AppstoreAddOutlined />),
  getItem('病种管理', '2', <ContainerOutlined />),
  getItem('用户管理', '/userInfo', <UserOutlined />),
  getItem('考试管理', '/examManage', <ReconciliationOutlined />, [
    getItem('考题管理', '4', <FolderOpenOutlined />),
    getItem('试卷管理', '5', <FileTextOutlined />),
  ]),

  getItem('医院管理', 'sub2', <PieChartOutlined />, [
    getItem('科室管理', '6', <ContactsOutlined />),
    getItem('药品管理', '7', <HddOutlined />),
    getItem('疫苗管理', '8', <MedicineBoxOutlined />),
  ]),

  getItem('职能学习管理', 'sub3', <IdcardOutlined />, [
    getItem('岗位角色管理', '9', <TeamOutlined />),
    getItem('流程管理', '10', <PartitionOutlined />),
  ])
];




const SystemMenu: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
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


  // const outlet =  useRoutes(Router);
  const menuClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e.key);
    // 点击跳转到对应的路由 -- 用到hook -- 调用navigateTo?gi
    navigateTo(e.key);
  };

  //点击上传病例
  const upLoadCase = (e) => {
    console.log('跳转至上传病例页面');
    navigateTo('/caseManage/caseUpload');
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左边侧边栏 */}
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        {/* <div className = "logo" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} /> */}
        <Menu theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onClick={menuClick} />
      </Sider>
      {/* 右边的内容 */}
      {/* TODO 这个背景色如何与主页面一致？ */}
      <Layout className="site-layout" >
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content className='site-layout-content'>
          <div style={{ margin: 16 }}>
            <Button type="primary" onClick={upLoadCase}>上传病例<UploadOutlined /> </Button>
          </div>
          
          {/* 病例的表格 */}
          <div className='case_box' style={{ margin: 16 }} >
            <Table className="case_table" columns={columns} dataSource={caseData} />;
          </div>
          <Outlet />

        </Content>

      </Layout>
    </Layout>
  );
};

export default SystemMenu;