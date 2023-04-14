import React, { useEffect, useState } from 'react';
import { FormOutlined, ClockCircleOutlined, TagsOutlined} from '@ant-design/icons';
import { Modal } from 'antd';
import { List, Space} from 'antd';
import { examCardData } from './mockExamData.tsx';
import { examList } from './examTypeDefine.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { mytoken } from '../token.js';
import cat from '../../Assets/image/cat2.png'
import cat2 from '../../Assets/image/cat3.png'
import { useSelector } from 'react-redux';

export interface examListProps {
  chooseTab: number;
  setStartExam: (startExam: boolean) => void;
  setExamDetailId : (id: number) => void;
}  

const ExamList = ( props: examListProps) => {

  const userLogin = useSelector((state:any) => state.userLogin)
  const { userInfo } = userLogin
  
  const initial_examList:examList[] = []
  const navigate = useNavigate()
  const [ modalOpen, setModalOpen ] = useState<boolean>(false);
  const [ startHour, setStartHour ] = useState<string>('');
  const [ startMinute, setStartMinute ] = useState<string>('');
  const [ endHour, setEndHour ] = useState<string>('');
  const [ endMinute, setEndMinute ] = useState<string>('');
  const [ day, setDay ] = useState<string>('');
  const [ month, setMonth ] = useState<string>('');
  const [ year, setYear ] = useState<string>('');
  const [ examList, setExamList ]= useState<examList[]>(initial_examList);

  const config = {
    headers:{
      "Authorization": userInfo.data.result.token,
    }
  };
  
  useEffect(() => {
		const fetchDetail = async() => {
      const url_notdone='https://47.120.14.174:443/petHospital/mytest/category'
      const url_record='https://47.120.14.174:443/petHospital/mytest/records/category'

      const url = props.chooseTab == 1? url_notdone : url_record;

      const { data } = await axios.get(url,config);
      setExamList(data.result);
      console.log(data.result);
    }
    fetchDetail();
	},[props.chooseTab])
  
  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  // "2023-04-07T10:00:00.000+00:00"
  const getDateAndTimeFromString = (whenstart: string, whenend: string) => {
    const date = whenstart.split('T')[0];
    const startime = whenstart.split('T')[1].split('.')[0];
    const endtime = whenend.split('T')[1].split('.')[0];

    setYear(date.split('-')[0]);
    setMonth(date.split('-')[1]);
    setDay(date.split('-')[1]);

    setStartHour(startime.split(':')[0])
    setStartMinute(startime.split(':')[1])

    setEndHour(endtime.split(':')[0])
    setEndMinute(endtime.split(':')[1])
  }

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
            dataSource={examList}
            footer={
              <div style={{fontSize:'18px'}}>
                <b>请选择试题进入考试</b>
              </div>
            }
            renderItem={(item:any) => (
              <List.Item
                key={item.testId}
                onClick={() => {
                  props.setExamDetailId(item.testId);
                  setModalOpen(true);
                }}
                actions={[
                  // <IconText icon={FormOutlined} text="共23道题" key="list-vertical-star-o" />,
                  <IconText icon={ClockCircleOutlined} text={`时长150分钟`} key="list-vertical-like-o" />,
                  <IconText icon={TagsOutlined} text={item.tag} key="list-vertical-message" />,
                ]}
                extra={ <img width={200} alt="logo" src={props.chooseTab==1?cat:cat2}/>}
              >
                {getDateAndTimeFromString(item.beginDate,item.endDate)}
                <List.Item.Meta className='exam-card-title'
                  title={<div style={{fontSize:'24px'}}><a>{item.testName}</a></div>}
                  description={`考试时间：${year}-${month}-${day} ${startHour}:${startMinute}-${endHour}:${endMinute}`}
                /> {item.intro}
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