import React, { useState } from 'react';
import { Col, Layout, MenuProps, Row } from 'antd';
import { Menu } from 'antd';
import { Container } from 'react-bootstrap';
import { Link, Navigate, Outlet, Route, Routes } from "react-router-dom";
import UserInfo from './userManage/userInfo.tsx';
import CaseInfo from './caseManage/caseInfo.tsx';
import DiseaseInfo from './diseaseManage/diseaseInfo.tsx';
import ExamQuestion from './examManage/questionManage/examQuestionInfo.tsx';
import QuestionInsert from './examManage/questionManage/questionInsert.tsx';
import TestInfo from './examManage/testManage/testInfo.tsx';
import TestInsert from './examManage/testManage/testInsert.tsx';
import TestDetail from './examManage/testManage/testDetail.tsx';
import TestUpdate from './examManage/testManage/testUpdate.tsx';
import CaseInsert from './caseManage/caseInsert/caseInsert.tsx';
import CaseUpdate from './caseManage/caseUpdate.tsx';
import CaseDetail from './caseManage/caseDetail.tsx';
import PaperInfo from './examManage/paperManage/paperInfo.tsx';
import PaperDetail from './examManage/paperManage/paperDetail.tsx';
import PaperUpdate from './examManage/paperManage/paperUpdate.tsx';
import PaperGenerate from './examManage/questionManage/generatePaper.tsx';
import ProcessInfo from './learnManage/processManage/processInfo.tsx';
import ProcessDetail from './learnManage/processManage/processDetail.tsx';
import ProcessInsert from './learnManage/processManage/processInsert.tsx';
import ProcessUpdate from './learnManage/processManage/processUpdate.tsx';
import RoleInfo from './learnManage/roleManage/roleInfo.tsx';
import RoleDetail from './learnManage/roleManage/roleDetail.tsx';
import RoleUpdate from './learnManage/roleManage/roleUpdate.tsx';
import RoleInsert from './learnManage/roleManage/roleInsert.tsx';
import MedicineInfo from './hospitalManage/medicineManage/medicineManage.tsx';
import MedicineDetail from './hospitalManage/medicineManage/medicineDetail.tsx';
import DepartmentInfo from './hospitalManage/departmentManage/departmentManage.tsx';
import VaccineInfo from './hospitalManage/vaccineManage/vaccineManage.tsx';
import QuestionDetail from './examManage/questionManage/questionDetail.tsx';
import QuestionUpdate from './examManage/questionManage/questionUpdate.tsx';
import InspectionInfo from './hospitalManage/inspectionItemManage/inspectionItemInfo.tsx';

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
  CalendarOutlined,
  ProfileOutlined
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
  getItem(<Link to="/systemManage/case" style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '18px' }}>病例管理</Link>, '/case', <AppstoreAddOutlined />),
  getItem(<Link to="/systemManage/disease" style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '18px' }}>病种管理</Link>, '/disease', <ContainerOutlined />),
  getItem(<Link to="/systemManage/user" style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '18px' }}>用户管理</Link>, '/user', <UserOutlined />),
  getItem('考试管理', 'exam', <ReconciliationOutlined />, [
    getItem(<Link to="/systemManage/exercise" style={{ textDecoration: 'none' }}>考题管理</Link>, '/exercise', <FolderOpenOutlined />),
    getItem(<Link to="/systemManage/paper" style={{ textDecoration: 'none' }}>试卷管理</Link>, '/paper', <FileTextOutlined />),
    getItem(<Link to="/systemManage/test" style={{ textDecoration: 'none' }}>场次管理</Link>, '/test', <CalendarOutlined />)
  ]),
  getItem('医院管理', 'hospital', <PieChartOutlined />, [
    getItem(<Link to="/systemManage/department" style={{ textDecoration: 'none' }}>科室管理</Link>, '/department', <ContactsOutlined />),
    getItem(<Link to="/systemManage/medicine" style={{ textDecoration: 'none' }}>药品管理</Link>, '/medicine', <HddOutlined />),
    getItem(<Link to="/systemManage/vaccine" style={{ textDecoration: 'none' }}>疫苗管理</Link>, '/vaccine', <MedicineBoxOutlined />),
    getItem(<Link to="/systemManage/inspection" style={{ textDecoration: 'none' }}>检查管理</Link>, '/inspection', <ProfileOutlined />),

  ]),
  getItem('职能学习管理', 'study', <IdcardOutlined />, [
    getItem(<Link to="/systemManage/role" style={{ textDecoration: 'none' }}>岗位角色管理</Link>, '/role', <TeamOutlined />),
    getItem(<Link to="/systemManage/process" style={{ textDecoration: 'none' }}>流程管理</Link>, '/process', <PartitionOutlined />),
  ])
];

// submenu keys of first level
const rootSubmenuKeys = ['/case', '/disease', '/user', 'exam', 'hospital', 'study'];

function SystemManage() {

  // 布局相关
  const { Content, Sider } = Layout;

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
    <Layout className='system-manage'>
      <Sider className='system-manage-sider '>
        <Menu
          defaultSelectedKeys={['/case']}
          mode="inline"
          items={items}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          style={{ width: '200px', borderRadius: 10, opacity: 1, height: '660px' }}>
        </Menu>
      </Sider>

      <Layout className="system-manage-right">
        <Content >
          <Routes>
            <Route path="case" element={<CaseInfo />} />
            <Route path="disease" element={<DiseaseInfo />} />
            <Route path="user" element={<UserInfo />} />
            <Route path="exercise" element={<ExamQuestion />} />
            <Route path="exercise/detail/:questionId" element={<QuestionDetail />} />
            <Route path="exercise/update/:questionId" element={<QuestionUpdate />} />
            <Route path="exercise/generate" element={<PaperGenerate />} />
            <Route path="paper" element={<PaperInfo />} />
            <Route path="paper/detail/:paper_id" element={<PaperDetail />} />
            <Route path="paper/update/:paper_id" element={<PaperUpdate />} />
            <Route path="test" element={<TestInfo />} />
            <Route path="test/detail/:testId" element={<TestDetail />} />
            <Route path="test/update/:testId" element={<TestUpdate />} />
            <Route path="test/insert" element={<TestInsert />} />
            <Route path="role" element={<RoleInfo />} />
            <Route path="role/insert" element={<RoleInsert />} />
            <Route path="role/detail/:actorId" element={<RoleDetail />} />
            <Route path="role/update/:actorId" element={<RoleUpdate />} />
            <Route path="department" element={<DepartmentInfo />} />
            <Route path="medicine" element={<MedicineInfo />} />
            <Route path="medicine/detail/:id" element={<MedicineDetail />} />
            <Route path="vaccine" element={<VaccineInfo />} />
            <Route path="inspection" element={<InspectionInfo />} />
            <Route path="process" element={<ProcessInfo />} />
            <Route path="process/insert" element={<ProcessInsert />} />
            <Route path="process/detail/:processId" element={<ProcessDetail />} />
            <Route path="process/update/:processId" element={<ProcessUpdate />} />
            <Route path="" element={<Navigate to="/systemManage/case" />} />
            <Route path="case/insert" element={<CaseInsert />} />
            <Route path="case/detail/:case_id" element={<CaseDetail />} />
            <Route path="case/update/:case_id" element={<CaseUpdate />} />
            <Route path="exercise/insert" element={<QuestionInsert />} />
            <Route path="paper/insert" element={<TestInsert />} />

          </Routes>

          <Outlet />

        </Content>
      </Layout>

      {/* <Container style={{ height: '100%' }}>
      <Row gutter={8} align="top">
        <Col span={5}>
          <div>
            <Menu
              defaultSelectedKeys={['/case']}
              mode="inline"
              items={items}
              openKeys={openKeys}
              onOpenChange={onOpenChange}
              style={{ width: 256, borderRadius: 10, opacity: 0.8, height: '100%' }}>
            </Menu>

          </div>
        </Col>
        <Col span={19}>
          <div style={{ height: '100%', opacity: 0.8 }}>
            <Routes>
              <Route path="case" element={<CaseInfo />} />
              <Route path="disease" element={<DiseaseInfo />} />
              <Route path="user" element={<UserInfo />} />
              <Route path="exercise" element={<ExamQuestion />} />
              <Route path="exercise/generate" element={<PaperGenerate />} />
              <Route path="paper" element={<PaperInfo />} />
              <Route path="test" element={<TestInfo />} />
              <Route path="test/insert" element={<TestInsert />} />
              <Route path="department" element={<Page2 />} />
              <Route path="medicine" element={<Page1 />} />
              <Route path="vaccine" element={<Page2 />} />
              <Route path="role" element={<Page1 />} />
              <Route path="procedure" element={<Page2 />} />
              <Route path="" element={<Navigate to="/systemManage/case" />} />
              <Route path="case/insert" element={<CaseInsert />} />
              <Route path="exercise/insert" element={<QuestionInsert />} />
            </Routes>
            <div>
              <Outlet />
            </div>
          </div>
        </Col>
      </Row >


    </Container > */}
    </Layout >


  );
};

export default SystemManage;