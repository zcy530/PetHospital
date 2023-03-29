import React, { useState } from 'react';
import { LaptopOutlined, MailOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Row, Col} from 'antd';
import { dataFrom_Categories, dataFrom_oneDiseaseCaseMenu,caseData } from './mockData.tsx';
import {Card}  from 'react-bootstrap';
import { oneDiseaseCaseMenu } from './caseTypeDefine.tsx';
import Link from 'antd/es/typography/Link';
import Detail from './details.tsx';

const CaseLearnVer2 = () => {

  const { Content, Sider } = Layout;

  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailID, setDetailID] = useState<number>(0)


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
        })
      };
  });


  return (
      <Layout className='learn-case'>
        {/* 侧边栏 */}
        <Sider className='learn-slider'>
          <Menu
            className='learn-slidermenu'
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
          { !showDetail ? (
            // 展示病例列表
            <Row gutter={16}>
              {dataFrom_oneDiseaseCaseMenu.map((value:oneDiseaseCaseMenu) => (
                <Col span={6}>
                  <Card className='learn-card'>
                    <Card.Header>{value.caseName}</Card.Header>
                    <Card.Img variant="top" src={value.frontGraph} style={{borderRadius:'15px 15px 0 0'}}/>
                    <Card.Body>
                      {/* <Card.Title>{value.title}</Card.Title> */}
                      <Card.Text className='card-content'>{value.admissionText}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      <Link onClick={() => {
                        setShowDetail(true);
                        setDetailID(value.caseId);
                        }}>查看详情
                      </Link>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            // 展示详细信息
            <Detail 
              id={detailID}
              showDetail={showDetail}
              setShowDetail={setShowDetail}/>
          )}
          </Content>
        </Layout>

      </Layout>
  );
};

export default CaseLearnVer2;