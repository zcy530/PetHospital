import React, { useState, useEffect } from 'react'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { Divider, Layout, Row, Col, Badge, Descriptions, Image } from 'antd';
import axios from "axios";
import { oneDiseaseCaseDetail } from './caseTypeDefine.tsx';
import { dataFrom_oneDiseaseCaseDetail } from './mockData.tsx';
import Cat from "../../Assets/image/cat2.png";

export interface detailsProps {
  id: number;
  showDetail: boolean;
  setShowDetail: (showDetail: boolean) => void;
}

const CaseDetail = (props : detailsProps) => {

  const [caseDetail, setCaseDetail]= useState<oneDiseaseCaseDetail>(dataFrom_oneDiseaseCaseDetail);

  const config = {
    headers:{
      "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6Im1hbmFnZXIiLCJpc3MiOiJzZWN1cml0eSIsImlhdCI6MTY4MDEwMzQ2MiwiYXVkIjoic2VjdXJpdHktYWxsIiwiZXhwIjoxNjgwMTEwNjYyfQ.y-zKf4y5Ip3ySS1kwwtzR7mPm-LCiWrPn2reV5O6Yl8",
    }
  };
  
  useEffect(() => {
		const fetchDetail = async() => {
      
      const { data } = await axios.get(`/cases/${props.id}?front=1`,config);
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
              <h4>{caseDetail.caseName}</h4>
            </Col>
            <Col span={3}>
             查看下一条<AiOutlineArrowRight style={{ fontSize: "30px" }} onClick={()=> props.setShowDetail(false)}/>
            </Col>
        </Row>
        <Divider />
        <h5>就诊记录</h5>
        <Layout className='detail-table'>
          <Descriptions 
            column={3}
            bordered size='middle'
            labelStyle={{justifyContent:'flex-end'}}
            contentStyle={{justifyContent:'flex-end'}}>
            <Descriptions.Item label="动物种类">英短猫</Descriptions.Item>
            <Descriptions.Item label="就医时间">2022.03.04</Descriptions.Item>
            <Descriptions.Item label="就医地点">安永宠物医院</Descriptions.Item>
            <Descriptions.Item label="病种大类">肠胃病</Descriptions.Item>
            <Descriptions.Item label="接诊描述" span={2}>接诊信息患者是一只成年英短猫，情绪低落，厌食</Descriptions.Item>
            <Descriptions.Item label="病种小类">胃炎</Descriptions.Item>
            <Descriptions.Item label="诊断信息" span={2}>诊断信息为慢性胃炎</Descriptions.Item>
            <Descriptions.Item label="治疗建议" span={3}>
              需要吃一周xx胃炎药，一天一次
            </Descriptions.Item>
            <Descriptions.Item label="联系方式">13896796126</Descriptions.Item>
            <Descriptions.Item label="收费">120元</Descriptions.Item>
            <Descriptions.Item label="住址">太极大道32号</Descriptions.Item>
            <Descriptions.Item label="图片描述">
            <Image.PreviewGroup
              preview={{
                onChange: (current, prev) => 
                  console.log(`current index: ${current}, prev index: ${prev}`),
              }}
            >
              <Image width={300} src={Cat}/>
              <Image width={300} src={Cat}/>
              <Image width={300} src={Cat}/>
              <Image width={300} src={Cat}/>
            </Image.PreviewGroup>
            </Descriptions.Item>
          </Descriptions>
        </Layout>

        <h5>检查记录</h5>
        <Layout className='detail-table-2'>
          <Descriptions  
            column={3}
            bordered size='middle'
            labelStyle={{justifyContent:'flex-end'}}
            contentStyle={{justifyContent:'flex-end'}}>
            <Descriptions.Item label="部门名称" span={2}>化验室</Descriptions.Item>
            <Descriptions.Item label="检查内容">查血</Descriptions.Item>
            <Descriptions.Item label="检查结束">验血相关xxxx</Descriptions.Item>
            <Descriptions.Item label="检查结果">无感染</Descriptions.Item>
            <Descriptions.Item label="费用">100.00</Descriptions.Item>

            <Descriptions.Item label="部门名称" span={2}>化验室</Descriptions.Item>
            <Descriptions.Item label="检查内容">查血</Descriptions.Item>
            <Descriptions.Item label="检查结束">验血相关xxxx</Descriptions.Item>
            <Descriptions.Item label="检查结果">无感染</Descriptions.Item>
            <Descriptions.Item label="费用">100.00</Descriptions.Item>

          </Descriptions>
        </Layout>

    </Layout>
  )
}
export default CaseDetail;