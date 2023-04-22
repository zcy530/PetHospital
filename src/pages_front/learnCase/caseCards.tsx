import React, { useEffect, useState } from 'react';
import { Row, Col, Pagination} from 'antd';
import {Card}  from 'react-bootstrap';
import { oneDiseaseCaseMenu } from './caseTypeDefine.tsx';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import { mytoken } from '../token.js';
import { useSelector } from 'react-redux';

export interface detailsProps {
    id: number;
    showDetail: boolean;
    setShowDetail: (showDetail: boolean) => void;
    detailID: number;
    setDetailID: (detailID: number) => void;
  }

const CaseCards = ( props: detailsProps) => {

  const userLogin = useSelector((state:any) => state.userLogin)
  const { userInfo } = userLogin
  const initial_allCase : oneDiseaseCaseMenu[]=[]
  const [allCase, setAllCase] = useState<oneDiseaseCaseMenu[]>(initial_allCase)

  const config = {
    headers:{
      "Authorization": userInfo.data.result.token,
    }
  };

  useEffect(() => {
		const fetchCategory = async() => {
      
      const { data } = await axios.get(`https://47.120.14.174:443/petHospital/diseases/${props.id}/cases`,config);
      setAllCase(data.result);
      console.log(props.id)
    }
    fetchCategory();
	},[props.id])

  return (
    <>
    <Row gutter={16}>
      {allCase.map((value:oneDiseaseCaseMenu,i) => (
        <Col span={6}>
            <Card className='learn-card'>
            <Card.Header>{value.caseName}</Card.Header>
            <Card.Img variant="top" src={value.frontGraph} style={{borderRadius:'0px 0px 0 0'}}/>
            <Card.Body>
                {/* <Card.Title>{value.title}</Card.Title> */}
                <Card.Text className='card-content'>{value.admissionText}</Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                <Link onClick={() => {
                    props.setShowDetail(true);
                    props.setDetailID(value.caseId);
                }}>查看详情
                </Link>
            </Card.Footer>
            </Card>
        </Col>
        ))}
    </Row>
    <Pagination style={{marginTop:"20px"}} defaultCurrent={1} total={5} />
    </>
  );
};

export default CaseCards;