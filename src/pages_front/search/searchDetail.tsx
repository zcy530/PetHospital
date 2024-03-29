import React, { useState, useEffect } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Divider, Layout, Row, Col, Badge, Descriptions, Image } from 'antd';
import axios from "axios";
import { oneDiseaseCaseDetail } from './caseTypeDefine.tsx';
import { dataFrom_oneDiseaseCaseDetail } from './../learnCase/mockData.tsx';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const SearchDetail = () => {
  
  const params = useParams()
  const id = params.id;
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
      
      const { data } = await axios.get(`https://47.120.14.174:443/petHospital/cases/${id}?front=1`,config);
      setCaseDetail(data.result);
      console.log(data.result);
      
      caseDetail.treatmentVideoList.map((item, i) => (
        console.log(item)
     ))
    }
    fetchDetail();
	},[])

  return(
    <div className='search-bar'>
    <Layout className='detail-area'>
        <Row>
            <Col span={2}>
             <AiOutlineArrowLeft style={{ fontSize: "30px" }} onClick={()=> { window.history.back() }}/>返回
            </Col>
            <Col span={22}>
              <h2>{caseDetail.caseName}</h2>
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
            <Descriptions.Item label="病种大类" span={2}>{caseDetail.caseName.split('病例')[0]}</Descriptions.Item>
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

        <h3>治疗方案</h3>
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
            {/* <video id="playChatVideo"  width="680" height="410" style={{marginBottom:'20'}} controls>
              <source src={caseDetail.treatmentVideoList[0]} type="video/mp4"></source>s
            </video> */}

            {caseDetail.treatmentVideoList.map((item, i) => (
                 
                  <video id="playChatVideo" width="610" height="410" style={{ marginBottom: '20' }} controls>
                      <source src={item} type="video/mp4"></source>
                  </video>
             ))}
            </Descriptions.Item>
            </Descriptions>
        </Layout>

    </Layout>
    </div>
  )
}
export default SearchDetail;