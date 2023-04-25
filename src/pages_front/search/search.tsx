import React, { useEffect, useState } from 'react';
import { Row, Col, Pagination} from 'antd';
import {Card}  from 'react-bootstrap';
import { oneDiseaseCaseMenu } from './caseTypeDefine.tsx';
import Link from 'antd/es/typography/Link';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const Search = () => {

  // react-router   
  const navigate = useNavigate()
  const params = useParams()
  const text = params.text

  // redux
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
      
      const { data } = await axios.get(`https://47.120.14.174:443/petHospital/categories/cases/${text}`,config);
      setAllCase(data.result);
      console.log(data)
    }
    fetchCategory();
	},[text])

  return (
    <div className='search-bar'>
        <h5>以下是<text style={{color:'blue'}}>{text}</text>的搜索结果：</h5>
    <div className='search-area'>
    <Row gutter={16}>
      {allCase.map((value:oneDiseaseCaseMenu,i) => (
        <Col span={6}>
            <Card className='search-card'>
            <Card.Header>{value.caseName}</Card.Header>
            <Card.Img variant="top" src={value.frontGraph} style={{borderRadius:'0px 0px 0 0'}}/>
            <Card.Body>
                {/* <Card.Title>{value.title}</Card.Title> */}
                <Card.Text className='card-content'>{value.admissionText}</Card.Text>
            </Card.Body>
            <Card.Footer className="text-muted">
                <Link onClick={() => {
                  navigate(`/searchdetail/${value.caseId}`)
                }}>查看详情
                </Link>
            </Card.Footer>
            </Card>
        </Col>
        ))}
    </Row>
    </div>
    </div>
  );
};

export default Search;