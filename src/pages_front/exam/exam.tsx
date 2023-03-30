import React, { useState } from 'react';
import { FormOutlined, ClockCircleOutlined, MessageOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Avatar, List, Space} from 'antd';
import { examCardData } from './mockExamData.tsx';
import { Tab } from 'react-bootstrap';

const Exam = () => {

  const { Content, Sider } = Layout;

  const tabItems: MenuProps['items'] = ['所有考试','我的考试'].map((info, index) => {
      return {
        key: index + 1,
        label: info,
      };
  });

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  

  return (
    <Tab.Container>
      <Layout className='learn-case'>
        {/* 侧边栏 */}
        <Sider className='learn-slider'>
          <Menu
            className='exam-slidermenu'
            mode="inline"
            defaultSelectedKeys={['0']}
            defaultOpenKeys={['0']}
            items={tabItems}
          />
        </Sider>

        {/* 右边的内容 */}
        <Layout className='exam-rightarea'>
          <Content className='learn-rightcontent'>
          <List
            itemLayout="vertical"
            size="large"
            className='exam-list'
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 3,
            }}
            dataSource={examCardData}
            footer={
              <div>
                <b>请选择试题进入考试</b>
              </div>
            }
            renderItem={(item:any) => (
              <List.Item
                key={item.title}
                actions={[
                  <IconText icon={FormOutlined} text="共23道题" key="list-vertical-star-o" />,
                  <IconText icon={ClockCircleOutlined} text="时长120分钟" key="list-vertical-like-o" />,
                  <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                ]}
                extra={
                  <img
                    width={272}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  />
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.description}
                />
                {item.content}
              </List.Item>
            )}
          />
          </Content>
        </Layout>

      </Layout>
    </Tab.Container>
  );
};

export default Exam;