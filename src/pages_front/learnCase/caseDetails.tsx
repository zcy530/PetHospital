import React, { useState, useEffect } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Divider, Layout, Row, Col, Badge, Descriptions, Image } from 'antd';
import axios from "axios";
import { oneDiseaseCaseDetail } from './caseTypeDefine.tsx';
import { dataFrom_oneDiseaseCaseDetail } from './mockData.tsx';
import Cat from "../../Assets/image/cat2.png";
import { useSelector } from 'react-redux';
import {
  Player,
  ControlBar,
  PlayToggle, // PlayToggle 播放/暂停按钮 若需禁止加 disabled
  ReplayControl, // 后退按钮
  ForwardControl,  // 前进按钮
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,  // 倍速播放选项
  VolumeMenuButton
} from 'video-react';

export interface detailsProps {
  id: number;
  showDetail: boolean;
  setShowDetail: (showDetail: boolean) => void;
}

const CaseDetail = (props : detailsProps) => {
  const userLogin = useSelector((state:any) => state.userLogin)
  const { userInfo } = userLogin
  const [caseDetail, setCaseDetail]= useState<oneDiseaseCaseDetail>(dataFrom_oneDiseaseCaseDetail);

  const config = {
    headers:{
      "Authorization": userInfo.data.result.token,
    }
  };
  
  useEffect(() => {
		const fetchDetail = async() => {
      
      const { data } = await axios.get(`https://47.120.14.174:443/petHospital/cases/${props.id}?front=1`,config);
      setCaseDetail(data.result);
      console.log(data.result);
    }
    fetchDetail();
	},[])

  return(
    <Layout className='detail-area'>
        <Row>
            <Col span={3}>
             <AiOutlineArrowLeft style={{ fontSize: "30px" }} onClick={()=> props.setShowDetail(false)}/>返回目录
            </Col>
            <Col span={18}>
              <h2>{caseDetail.caseName}</h2>
            </Col>
            <Col span={3}>
             查看下一条<AiOutlineArrowRight style={{ fontSize: "30px" }} onClick={()=> props.setShowDetail(false)}/>
            </Col>
        </Row>
        <Divider />
        <h3>就诊记录</h3>
        <Layout className='detail-table'>
          <Descriptions 
            column={3}
            bordered size='middle'
            labelStyle={{justifyContent:'flex-end'}}
            contentStyle={{justifyContent:'flex-end'}}>       
            <Descriptions.Item label="病种大类">{caseDetail.caseName.split('病例')[0]}</Descriptions.Item>
            <Descriptions.Item label="就医时间">2022.03.04</Descriptions.Item>
            <Descriptions.Item label="就医地点">安永宠物医院</Descriptions.Item>
            <Descriptions.Item label="接诊描述" span={3}>{caseDetail.admissionText}</Descriptions.Item>
            <Descriptions.Item label="诊断信息" span={3}>{caseDetail.diagnosticInfo}</Descriptions.Item>
            <Descriptions.Item label="治疗建议" span={3}>{caseDetail.treatmentInfo}</Descriptions.Item>
            <Descriptions.Item label="图片描述">
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) => 
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              {caseDetail.admissionGraphList.map((item,i)=>(
                <Image width={350} height={250} style={{padding:'10px'}} src={item}/>
              ))}
            </Image.PreviewGroup>
            </Descriptions.Item>
          </Descriptions>
        </Layout>

        <h3>检查记录</h3>
        <Layout className='detail-table-2'>
          <Descriptions  
            column={3}
            bordered size='middle'
            labelStyle={{justifyContent:'flex-end'}}
            contentStyle={{justifyContent:'flex-end'}}>
            {caseDetail.inspectionFrontDTOList.map((item,i)=>(
              <>
              <Descriptions.Item label="部门名称" span={2}>{item.departmentName}</Descriptions.Item>
              <Descriptions.Item label="检查内容">{item.itemName}</Descriptions.Item>
              <Descriptions.Item label="检查结束">{item.result}</Descriptions.Item>
              <Descriptions.Item label="检查结果">{item.intro}</Descriptions.Item>
              <Descriptions.Item label="费用">{item.fee}</Descriptions.Item>
              <Descriptions.Item label="图片描述" span={3}>
                <Image.PreviewGroup
                  preview={{
                    onChange: (current, prev) => 
                      console.log(`current index: ${current}, prev index: ${prev}`),
                  }}
                >
                  {item.inspectionGraphList.map((item,i)=>(
                    <Image width={350} height={250} style={{padding:'10px'}} src={item}/>
                  ))}
                </Image.PreviewGroup>
              </Descriptions.Item>
              </>
            ))}

          </Descriptions>
        </Layout>

        <h3>就诊记录</h3>
        <Layout className='detail-table-2'>
          <Descriptions  
            column={3}
            bordered size='middle'
            labelStyle={{justifyContent:'flex-end'}}
            contentStyle={{justifyContent:'flex-end'}}>
            <Descriptions.Item label="图片描述" span={3}>
              <Image.PreviewGroup
                preview={{
                  onChange: (current, prev) => 
                    console.log(`current index: ${current}, prev index: ${prev}`),
                }}
              >
                {caseDetail.treatmentGraphList.map((item,i)=>(
                  <Image width={350} height={250} style={{padding:'10px'}} src={item}/>
                ))}
              </Image.PreviewGroup>
            </Descriptions.Item>
            <Descriptions.Item label="视频描述" span={3}>
            <video id="playChatVideo"  width="680" height="410" style={{marginBottom:'20'}} controls>
              <source src={"https://pet-hospital-back-end-video.oss-cn-shanghai.aliyuncs.com/00225video_publisheranonymousUser/VID_20230405_210947.mp4"} type="video/mp4"></source>
            </video>
            </Descriptions.Item>
            </Descriptions>
        </Layout>

    </Layout>
  )
}
export default CaseDetail;