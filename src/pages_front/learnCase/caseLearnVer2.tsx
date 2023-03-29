import React from 'react';
import { LaptopOutlined, MailOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Row, Col} from 'antd';
import { dataFrom_Categories } from './mockData.tsx';
import {Card}  from 'react-bootstrap';
import cat from "../../Assets/image/cat.svg";
import { caseData } from './mockData.tsx'
import { diseaseCard } from './caseTypeDefine.tsx';
import Link from 'antd/es/typography/Link';

const { Header, Content, Sider } = Layout;

const tabItems: MenuProps['items'] = dataFrom_Categories.map((info, index) => {
    const key = index+1;
    return {
      key: key,
      label: info.typeName,
      children: info.diseaseDTOList.map((dto, subindex) => {
        const subKey = (index + 1) * 100 + subindex;
        return {
          key: subKey,
          label: dto.diseaseName,
        };
      }),
    };
  },
);

const CaseLearnVer2 = () => {

  return (

      <Layout className='learn-case'>
        {/* 侧边栏 */}
        <Sider className='learn-slider'>
          <Menu className='learn-slidermenu'
            mode="inline"
            defaultSelectedKeys={['0']}
            defaultOpenKeys={['0']}
            items={tabItems}
          />
        </Sider>

        {/* 右边的内容 */}
        <Layout className='learn-rightarea'>
          <Content className='learn-rightcontent'>
          <Breadcrumb className='learn-breadcrumb'>
            <Breadcrumb.Item>病例学习</Breadcrumb.Item>
            <Breadcrumb.Item>皮肤病</Breadcrumb.Item>
            <Breadcrumb.Item>湿疹</Breadcrumb.Item>
          </Breadcrumb>
          <Row gutter={16}>
          {caseData.map((value:diseaseCard) => (
            <Col span={6}>
              <Card className='learn-card'>
                <Card.Header>英短猫胃炎病例</Card.Header>
                <Card.Img variant="top" src={value.image} style={{borderRadius:'15px 15px 0 0'}}/>
                <Card.Body>
                  {/* <Card.Title>{value.title}</Card.Title> */}
                  <Card.Text className='card-content'>接诊信息患者是一只成年英短猫，情绪低落，厌食</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted"><Link>查看详情</Link></Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
          </Content>
        </Layout>

      </Layout>
  );
};

export default CaseLearnVer2;