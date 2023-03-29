import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Divider } from 'antd';
import axios from "axios";
import { diseaseInfo } from './caseConstants';

axios.defaults.baseURL = 'http://47.120.14.174:80/petHospital'

const Detail = () => {

  const exampleCase: diseaseInfo = 
    {
      typeId: 0,
      typeName: "皮肤病",
      diseaseDTOList: [
          {
              diseaseId: 3,
              diseaseName: "皮肤过敏",
              typeName: "皮肤病"
          }
      ]
  }

  const [mycase, setMyCase]= useState<diseaseInfo>(exampleCase);

  const config = {
    headers:{
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials":"true",
      "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwicm9sZSI6Im1hbmFnZXIiLCJpc3MiOiJzZWN1cml0eSIsImlhdCI6MTY3OTk5NDcwMywiYXVkIjoic2VjdXJpdHktYWxsIiwiZXhwIjoxNjgwMDAxOTAzfQ.PsPq0nGMNKFkbyevxSpLxIPQYQkQmuoYTa5NOsdMRSk",
    }
  };
  
  useEffect(() => {
		axios.get("/categories", config).then(value => {
			console.log(value.data.result[0].typeName);
			setMyCase(value.data.result[0]);
		})
	},[])

  return(
    <Container style={{borderRadius:'30px',margin:'auto',padding:'50px',width:'1200px'}}>
        <Row>
            <Col md={2} style={{marginLeft:'20px'}}>
             <AiOutlineArrowLeft style={{ fontSize: "2.5em" }} onClick={()=>window.history.back(-1)}/>
            </Col>
            <Col md={8}>
              <h1>{mycase.typeName}</h1>
            </Col>
        </Row>
        <Divider />
        <div style={{margin:'30px 150px 30px 150px'}}>
          <Card style={{marginBottom:'30px'}}>
            <Card.Header>皮肤过敏</Card.Header>
            <Card.Body>
              <blockquote className="blockquote mb-0">
                <p>
                  {'  '}
                  宠物过敏是对动物皮肤细胞、唾液或尿液中所含蛋白质的一种过敏反应。宠物过敏的症状包括花粉症的常见症状，如打喷嚏和鼻漏。{'  '}
                </p>
              </blockquote>
            </Card.Body>
            <Card.Footer className="text-muted">2 days ago</Card.Footer>
          </Card>
          <Card>
            <Card.Header>湿疹</Card.Header>
            <Card.Body>
              <blockquote className="blockquote mb-0">
                <p>
                  {'  '}
                  湿疹是一种主要病变部位发生在宠物皮肤的表皮层和真皮层的上层（乳头层）的常见性皮肤病。 湿疹的症状是皮肤出现红斑、丘疹、水疱、靡烂、痂皮等皮肤伤。{'  '}
                </p>
              </blockquote>
            </Card.Body>
            <Card.Footer className="text-muted">2 days ago</Card.Footer>
          </Card>
        </div>
    </Container>
  )
}
export default Detail;