import React, { useState } from 'react';
import { Col, MenuProps, Row } from 'antd';
import { Menu } from 'antd';
import { Container } from 'react-bootstrap';
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import UserInfo from './userManage/userInfo.tsx';
import CaseInfo from './caseManage/caseInfo.tsx';
import Page1 from "./systemMenu/Page1.tsx";
import Page2 from "./systemMenu/Page2.tsx";
import CaseInsert from './caseManage/caseInsert.tsx';

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

} from '@ant-design/icons';

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
    getItem(<Link to= "/systemManage/case" style={{textDecoration:'none'}}>病例管理</Link>, '/case', <AppstoreAddOutlined />),
    getItem(<Link to= "/systemManage/disease" style={{textDecoration:'none'}}>病种管理</Link>, '/disease', <ContainerOutlined />),
    getItem(<Link to= "/systemManage/user" style={{textDecoration:'none'}}>用户管理</Link>, '/user', <UserOutlined />),
    getItem('考试管理', 'exam', <ReconciliationOutlined />, [
        getItem(<Link to= "/systemManage/exercise" style={{textDecoration:'none'}}>考题管理</Link>, '/exercise', <FolderOpenOutlined />),
        getItem(<Link to= "/systemManage/paper" style={{textDecoration:'none'}}>试卷管理</Link>, '/paper', <FileTextOutlined />),
    ]),
    getItem('医院管理', 'hospital', <PieChartOutlined />, [
        getItem(<Link to= "/systemManage/department" style={{textDecoration:'none'}}>科室管理</Link>, '/department', <ContactsOutlined />),
        getItem(<Link to= "/systemManage/medicine" style={{textDecoration:'none'}}>药品管理</Link>, '/medicine', <HddOutlined />),
        getItem(<Link to= "/systemManage/vaccine" style={{textDecoration:'none'}}>疫苗管理</Link>, '/vaccine', <MedicineBoxOutlined />),
    ]),
    getItem('职能学习管理', 'study', <IdcardOutlined />, [
        getItem(<Link to= "/systemManage/role" style={{textDecoration:'none'}}>岗位角色管理</Link>, '/role', <TeamOutlined />),
        getItem(<Link to= "/systemManage/procedure" style={{textDecoration:'none'}}>流程管理</Link>, '/procedure', <PartitionOutlined />),
    ])
];

// submenu keys of first level
const rootSubmenuKeys = ['/case', '/disease', '/user','exam','hospital','study'];

function SystemManage ()  {
  const [openKeys, setOpenKeys] = useState(['/case']);
  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

return (
    <Container style={{height:'100%'}}>
      <Row gutter={8} align="top">
        <Col span={5}>
          <div>
          <Menu
            defaultSelectedKeys={['/case']}
            mode="inline"
            items={items}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            style={{ width: 256, borderRadius : 10, opacity : 0.8, height:'100%' }}>
          </Menu>
          
          </div>
        </Col>
        <Col span={19}>
          <div style={{height:'100%', opacity: 0.8}}>
          <Routes>
              <Route path="case"  element={<CaseInfo />} />
              <Route path="disease"  element={<Page2 />} />
              <Route path="user"  element={<UserInfo />} />
              <Route path="exercise"  element={<Page2 />} />
              <Route path="paper"  element={<Page1 />} />
              <Route path="department"  element={<Page2 />} />
              <Route path="medicine"  element={<Page1 />} />
              <Route path="vaccine"  element={<Page2 />} />
              <Route path="role"  element={<Page1 />} />
              <Route path="procedure"  element={<Page2 />} />
              <Route path="" element={<Navigate to ="/systemManage/case" />}/>
              <Route path="case/insert" element={<CaseInsert />}/>
          </Routes>
            <div>
              <Outlet/>
            </div>
          </div>
        </Col>
      </Row>
      
         
    </Container>
    
  );
};

export default SystemManage;