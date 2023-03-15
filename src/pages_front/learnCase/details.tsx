import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Divider } from 'antd';

const Detail = () => {
  return(
    <Container style={{backgroundColor:'rgb(255,255,255)',borderRadius:'30px',margin:'auto',padding:'50px',width:'1200px'}}>
        <Row>
            <Col md={2}>
             <AiOutlineArrowLeft style={{ fontSize: "2.5em" }} onClick={()=>window.history.back(-1)}/>
            </Col>
            <Col md={8}>
              <h1>蛔虫病</h1>
            </Col>
        </Row>
        <Divider />
        <div style={{margin:'30px 150px 30px 150px'}}>
            <p style={{fontSize:'20px'}}>
                宠物蛔虫病是由蛔虫寄生于宠物的肠道内所引起的一种寄生虫病。宠物蛔虫病一般分为犬蛔虫病和猫蛔虫病两种类型，其中最常见的是犬蛔虫病。
              犬蛔虫病和猫蛔虫病的病原体分别是犬蛔虫和猫蛔虫，它们是一种白色的细长蠕虫，一般体长在10-20厘米之间。它们的卵子可以通过宠物的粪便排出体外，然后在外部环境中孵化成幼虫，被宠物误食后再次感染。
              宠物蛔虫病的临床症状包括腹泻、呕吐、消瘦、营养不良、肚子胀、食欲不振等，严重时甚至会引起肠道梗阻。同时，宠物蛔虫病还可以传染给人类，特别是儿童，会导致身体不适、腹痛、恶心、呕吐等症状。
              预防宠物蛔虫病的方法包括定期为宠物驱虫、避免让宠物接触污染的环境和食物等。一旦发现宠物有蛔虫病的症状，应该立即带宠物去兽医处进行诊断和治疗。
            </p>
            <p style={{fontSize:'20px'}}>
                宠物蛔虫病是由蛔虫寄生于宠物的肠道内所引起的一种寄生虫病。宠物蛔虫病一般分为犬蛔虫病和猫蛔虫病两种类型，其中最常见的是犬蛔虫病。
              犬蛔虫病和猫蛔虫病的病原体分别是犬蛔虫和猫蛔虫，它们是一种白色的细长蠕虫，一般体长在10-20厘米之间。它们的卵子可以通过宠物的粪便排出体外，然后在外部环境中孵化成幼虫，被宠物误食后再次感染。
              宠物蛔虫病的临床症状包括腹泻、呕吐、消瘦、营养不良、肚子胀、食欲不振等，严重时甚至会引起肠道梗阻。同时，宠物蛔虫病还可以传染给人类，特别是儿童，会导致身体不适、腹痛、恶心、呕吐等症状。
              预防宠物蛔虫病的方法包括定期为宠物驱虫、避免让宠物接触污染的环境和食物等。一旦发现宠物有蛔虫病的症状，应该立即带宠物去兽医处进行诊断和治疗。
            </p>
        </div>
    </Container>
  )
}
export default Detail;