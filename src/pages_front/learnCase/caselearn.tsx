import React from 'react';
import { Link } from 'react-router-dom'
import {Card, Row, Col, Button, Container, Tab, Nav} from 'react-bootstrap';
import { diseaseCard } from './caseTypeDefine';
import { caseData, caseType} from './mockData.tsx'

// 因需求变更，此组件不再使用
// 新的版本在 caseLearnVer2.tsx

function CaseLearn() {
  return (
    <Container>
    <Tab.Container id="left-tabs-example" defaultActiveKey="传染病">
      <Row>
        <Col sm={2}>
          <Nav variant='pills' className="flex-column" >
            {caseType.map((variant) => (
              <Nav.Item>
                <Nav.Link eventKey={variant} style={{color:'whitesmoke'}}>{variant}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="传染病" style={{marginLeft:"40px"}}>
              <Row>
                {caseData.map((variant) => (
                  <Col sm={3}>
                    <Card className='caseCard'>
                      <Card.Img variant="top" src={variant.image} style={{borderRadius:'15px 15px 0 0',height:'100px'}}/>
                      <Card.Body>
                        <Card.Title>{variant.title}</Card.Title>
                        <Card.Text className='card-content'>{variant.content}</Card.Text>
                        <Button variant="outline-dark" size="sm" href='/#/detail'>查看</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="寄生虫病" style={{marginLeft:"40px"}}>
              <Row>
                  {caseData.map((variant) => (
                    <Col md={3}>
                      <Card className='caseCard'>
                        <Card.Img variant="top" src={variant.image} style={{borderRadius:'15px 15px 0 0',height:'100px'}}/>
                        <Card.Body>
                          <Card.Title>{variant.title}</Card.Title>
                          <Card.Text className='card-content'>{variant.content}</Card.Text>
                          <Button variant="outline-dark"  size="sm"  href='/detail'>Detail</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
            </Tab.Pane>
            <Tab.Pane eventKey="内科病" style={{marginLeft:"40px"}}>
              <Row>
                  {caseData.map((variant) => (
                    <Col md={3}>
                      <Card className='caseCard'>
                        <Card.Img variant="top" src={variant.image} style={{borderRadius:'15px 15px 0 0',height:'100px'}}/>
                        <Card.Body>
                          <Card.Title>{variant.title}</Card.Title>
                          <Card.Text className='card-content'>{variant.content}</Card.Text>
                          <Button variant="outline-dark"  size="sm"  href='/detail'>Detail</Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>

    </Container>
  );
}

export default CaseLearn;