import React, { Component, useState } from 'react';
import { FormOutlined, ClockCircleOutlined, TagsOutlined} from '@ant-design/icons';
import { MenuProps, Modal } from 'antd';
import { Breadcrumb, Layout, Menu, Avatar, List, Space} from 'antd';
import { examCardData } from './mockExamData.tsx';
import { Form, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ExamDetail from './examDetail.tsx';
import ExamList from './examList.tsx';
import ExamEnd from './examEnd.tsx';
import ExamAnswerCheck from './examAnswerCheck.tsx';

const Exam = () => {

  const { Content, Sider } = Layout;
  const [startExam, setStartExam] = useState<boolean>(false);
  const [endExam, setEndExam] = useState<boolean>(false);
  const [checkExamAnswer, setCheckExamAnswer] = useState<boolean>(false);
  const [chooseTab, setChooseTab] = useState<number>(1);
  const [examDetailId, setExamDetailId] = useState<number>(1);
  const [exitReminder, setExitReminder] = useState<boolean>(false);

  const tabItems: MenuProps['items'] = ['所有考试','我的考试'].map((info, index) => {
      return {
        key: index + 1,
        label: info,
      };
  });

  const renderRightComponent = () => {
    if(startExam) {
      return <ExamDetail id={examDetailId} setStartExam={setStartExam} setEndExam={setEndExam}/>
    } else if(endExam) {
      return <ExamEnd setEndExam={setEndExam} setExamAnswerCheck={setCheckExamAnswer} />
    } else if(checkExamAnswer) {
      return <ExamAnswerCheck id={examDetailId} setCheckExamAnswer={setCheckExamAnswer}/>
    } else {
      return <ExamList chooseTab={chooseTab} setStartExam={setStartExam} setExamDetailId={setExamDetailId} />
    }
  }

  return (
    <Tab.Container>
      <Layout className='learn-case'>
        {/* 侧边栏 */}
        <Sider className='learn-slider'>
          <Menu
            className='exam-slidermenu'
            mode="inline"
            onSelect={(item)=> {
              setChooseTab(parseInt(item.key));
              if(startExam){
                setExitReminder(true);
              } else {
                setEndExam(false);
                setCheckExamAnswer(false);
              }
            }}
            defaultSelectedKeys={['1']}
            items={tabItems}
          />

          <Modal
            title="考试须知"
            centered
            open={exitReminder}
            okText="确认退出"
            cancelText="取消"
            onOk={() => {
                setStartExam(false);
                setExitReminder(false);
            }}
            onCancel={() => setExitReminder(false) }
            width={600}
          >
            <b>考试正在进行中，离开将自动交卷请确认是否要退出考试？</b>
          </Modal>

          <div className='exam-tag-choose'>
            <b>选择tag筛选题目</b>
            <div className='exam-tag-choose-item'>
            {['肠胃病','皮肤病'].map((tags,subindex) => (
                <Form.Check  
                type="checkbox"
                id={tags}
                label={tags}
                />
            ))}
            </div>
          </div>
        </Sider>

        {/* 右边的内容 */}
        <Layout className='exam-rightarea'>
          <Content className='learn-rightcontent'>
            {renderRightComponent()}
          </Content>
        </Layout>

      </Layout>
    </Tab.Container>
  );
};

export default Exam;