import React, { useState } from 'react';
import { FormOutlined, ClockCircleOutlined, TagsOutlined} from '@ant-design/icons';
import { Modal } from 'antd';
import { List, Space} from 'antd';
import { examCardData } from './mockExamData.tsx';
import { useNavigate } from 'react-router-dom';

export interface examListProps {
  setStartExam: (startExam: boolean) => void;
}  

const ExamList = ( props: examListProps) => {

  const navigate = useNavigate()
  const [ modalOpen, setModalOpen ] = useState<boolean>(false);

  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  return (
    <>
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
                onClick={() => setModalOpen(true)}
                actions={[
                  <IconText icon={FormOutlined} text="共23道题" key="list-vertical-star-o" />,
                  <IconText icon={ClockCircleOutlined} text="时长120分钟" key="list-vertical-like-o" />,
                  <IconText icon={TagsOutlined} text="肠胃病" key="list-vertical-message" />,
                ]}
                extra={
                  <img
                    width={250}
                    alt="logo"
                    src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  />
                }
              >
                <List.Item.Meta
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.description}
                />
                {item.content}
              </List.Item>
            )}
          />
          <Modal
            title="考试须知"
            centered
            open={modalOpen}
            okText="开始考试"
            cancelText="取消"
            onOk={() => {
                setModalOpen(false);
                props.setStartExam(true);
            }}
            onCancel={() => setModalOpen(false) }
            width={600}
          >
            一、该考试为在线考试，有时间限制
            <br />
            二、考试期间不得离开考试页面，否则将自动交卷
            <br />
            三、考试请独立思考，不得与他人交流
            <br />
            四、若还没到开考的考试时间，请耐心等待
            <br />
            <br />
            <b>本场考试为：</b>
            <br />
            <b>本次考试的时间为：2022.3.4 13:00</b>
          </Modal>
    </>
  );
};

export default ExamList;