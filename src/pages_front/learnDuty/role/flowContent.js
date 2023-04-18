import React from 'react'
import './flowContent.css'
import imgUrl2 from "./04364f825091a4776732db4f7230c428.jpg";
import {Avatar, Card, Col, Collapse, Divider, Image, Row} from "antd";
const { Panel } = Collapse;

function flowContent({name, imgUrl, content,content2,title}) {
    return (
        <div >

            <Divider >{name}</Divider>
            {/*<p>{content2}</p>*/}
            {/*<Collapse accordion ghost={true}>*/}
            {/*    <Panel header={name} key="1">*/}
            {/*        <p>{content2}</p>*/}
            {/*    </Panel>*/}
            {/*    </Collapse>*/}

            <Row>
                <Col span={12}>
                    <div className='flowPic'>
                        <img src={imgUrl} alt=''/>
                    </div>
                </Col>
                <Col span={2}></Col>
                <Col span={9}>
                    <Card title={title}>
                        <div className='opeContent'>
                            {content}
                        </div>
                    </Card>
                </Col>
                <Col span={1}></Col>
            </Row>


        </div>

    )
}

export default flowContent
